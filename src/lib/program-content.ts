import { hasSupabaseConfig, readFromSupabase } from "@/lib/supabase-rest";

export type ProgramEvent = {
  slug: string;
  title: string;
  programType: "education" | "healthcare" | "sports" | "community";
  summary: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isFeatured: boolean;
  status: "draft" | "scheduled" | "completed" | "cancelled";
};

type SupabaseProgramEvent = {
  slug: string;
  title: string;
  program_type: "education" | "healthcare" | "sports" | "community";
  summary: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_featured: boolean;
  status: "draft" | "scheduled" | "completed" | "cancelled";
};

/**
 * Map Supabase record format to application format
 */
function mapSupabaseEvent(record: SupabaseProgramEvent): ProgramEvent {
  return {
    slug: record.slug,
    title: record.title,
    programType: record.program_type,
    summary: record.summary,
    description: record.description,
    location: record.location,
    startDate: record.start_date,
    endDate: record.end_date,
    isFeatured: record.is_featured,
    status: record.status,
  };
}

/**
 * Fetch program events from Supabase, filtered by status
 * Falls back to hardcoded events if Supabase is unavailable
 *
 * @param options - Filter options
 * @param options.status - Filter by status (default: "scheduled")
 * @param options.limit - Maximum number of events to return
 * @param options.includePast - Include past events (default: false)
 * @returns Array of program events sorted by start_date
 */
export async function getProgramEvents(options?: {
  status?: string;
  limit?: number;
  includePast?: boolean;
}): Promise<ProgramEvent[]> {
  const { status = "scheduled", limit, includePast = false } = options || {};

  try {
    if (!hasSupabaseConfig()) {
      return getFallbackProgramEvents();
    }

    // Build query string for Supabase
    let query = `status=eq.${status}&order=start_date.asc`;

    if (!includePast) {
      // Filter for future events only. Date-only so the cached query key is stable for a day.
      const today = new Date().toISOString().slice(0, 10);
      query += `&start_date=gte.${today}`;
    }

    if (limit) {
      query += `&limit=${limit}`;
    }

    const records = await readFromSupabase<SupabaseProgramEvent[]>(
      "program_events",
      query,
      { cache: "public" },
    );

    // If no records found in Supabase, return fallback
    if (!records || records.length === 0) {
      return getFallbackProgramEvents();
    }

    return records.map(mapSupabaseEvent);
  } catch (error) {
    console.error("Error fetching program events from Supabase:", error);
    // Fall back to hardcoded events on any error
    return getFallbackProgramEvents();
  }
}

/**
 * Get featured program events
 * @param options - Filter options
 * @returns Array of featured events
 */
export async function getFeaturedProgramEvents(options?: {
  limit?: number;
}): Promise<ProgramEvent[]> {
  try {
    if (!hasSupabaseConfig()) {
      return getFallbackProgramEvents();
    }

    let query = `is_featured=eq.true&status=eq.scheduled&order=start_date.asc`;

    if (options?.limit) {
      query += `&limit=${options.limit}`;
    }

    const records = await readFromSupabase<SupabaseProgramEvent[]>(
      "program_events",
      query,
      { cache: "public" },
    );

    if (!records || records.length === 0) {
      return getFallbackProgramEvents();
    }

    return records.map(mapSupabaseEvent);
  } catch (error) {
    console.error("Error fetching featured program events:", error);
    return getFallbackProgramEvents();
  }
}

/**
 * Get program events by type (education, healthcare, sports)
 * @param programType - The program type to filter by
 * @param options - Additional filter options
 * @returns Array of events for the specified program type
 */
export async function getProgramEventsByType(
  programType: "education" | "healthcare" | "sports" | "community",
  options?: {
    limit?: number;
  },
): Promise<ProgramEvent[]> {
  try {
    if (!hasSupabaseConfig()) {
      return getFallbackProgramEvents();
    }

    let query = `program_type=eq.${programType}&status=eq.scheduled&order=start_date.asc`;

    if (options?.limit) {
      query += `&limit=${options.limit}`;
    }

    const records = await readFromSupabase<SupabaseProgramEvent[]>(
      "program_events",
      query,
      { cache: "public" },
    );

    if (!records || records.length === 0) {
      return getFallbackProgramEvents();
    }

    return records.map(mapSupabaseEvent);
  } catch (error) {
    console.error(`Error fetching ${programType} program events:`, error);
    return getFallbackProgramEvents();
  }
}

/**
 * No hardcoded events: if the CMS has none, the calendar shows its empty state.
 */
function getFallbackProgramEvents(): ProgramEvent[] {
  return [];
}
