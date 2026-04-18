import {
  programEvents as fallbackProgramEvents,
} from "@/data/site";
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
 * Convert fallback hardcoded events to the standard format
 */
function mapFallbackEvent(event: (typeof fallbackProgramEvents)[0]): ProgramEvent {
  return {
    slug: event.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
    title: event.title,
    programType: event.program as "education" | "healthcare" | "sports" | "community",
    summary: event.summary,
    description: event.summary,
    location: event.location,
    startDate: event.date,
    endDate: null,
    isFeatured: false,
    status: "scheduled",
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
      return getFallbackProgramEvents({ limit, includePast });
    }

    // Build query string for Supabase
    let query = `status=eq.${status}&order=start_date.asc`;

    if (!includePast) {
      // Filter for future events only
      const now = new Date().toISOString();
      query += `&start_date=gte.${now}`;
    }

    if (limit) {
      query += `&limit=${limit}`;
    }

    const records = await readFromSupabase<SupabaseProgramEvent[]>(
      "program_events",
      query,
    );

    // If no records found in Supabase, return fallback
    if (!records || records.length === 0) {
      return getFallbackProgramEvents({ limit, includePast });
    }

    return records.map(mapSupabaseEvent);
  } catch (error) {
    console.error("Error fetching program events from Supabase:", error);
    // Fall back to hardcoded events on any error
    return getFallbackProgramEvents({ limit, includePast });
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
      return getFallbackProgramEvents(options);
    }

    let query = `is_featured=eq.true&status=eq.scheduled&order=start_date.asc`;

    if (options?.limit) {
      query += `&limit=${options.limit}`;
    }

    const records = await readFromSupabase<SupabaseProgramEvent[]>(
      "program_events",
      query,
    );

    if (!records || records.length === 0) {
      return getFallbackProgramEvents(options);
    }

    return records.map(mapSupabaseEvent);
  } catch (error) {
    console.error("Error fetching featured program events:", error);
    return getFallbackProgramEvents(options);
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
      return getFallbackProgramEvents(options);
    }

    let query = `program_type=eq.${programType}&status=eq.scheduled&order=start_date.asc`;

    if (options?.limit) {
      query += `&limit=${options.limit}`;
    }

    const records = await readFromSupabase<SupabaseProgramEvent[]>(
      "program_events",
      query,
    );

    if (!records || records.length === 0) {
      return getFallbackProgramEvents(options);
    }

    return records.map(mapSupabaseEvent);
  } catch (error) {
    console.error(`Error fetching ${programType} program events:`, error);
    return getFallbackProgramEvents(options);
  }
}

/**
 * Get fallback hardcoded program events
 */
function getFallbackProgramEvents(options?: {
  limit?: number;
  includePast?: boolean;
}): ProgramEvent[] {
  let events = fallbackProgramEvents.map(mapFallbackEvent);

  // Filter for future events if requested
  if (!options?.includePast) {
    const now = new Date();
    events = events.filter(
      (event) => new Date(event.startDate) >= now,
    );
  }

  // Sort by start date
  events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Apply limit if specified
  if (options?.limit) {
    events = events.slice(0, options.limit);
  }

  return events;
}
