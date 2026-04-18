import {
  impactMetrics as fallbackImpactMetrics,
  impactContextStats as fallbackContextStats,
} from "@/data/site";
import { hasSupabaseConfig, readFromSupabase } from "@/lib/supabase-rest";

export type ImpactMetric = {
  slug: string;
  label: string;
  value: string;
  numericValue: number | null;
  unit: string;
  category: "education" | "healthcare" | "sports" | "cross_cutting";
  isFeatured: boolean;
  sortOrder: number;
  metricYear: number | null;
  summary: string;
};

export type ContextStat = {
  slug: string;
  label: string;
  valueText: string;
  numericValue: number | null;
  unit: string;
  scope: string;
  statYear: number | null;
  sourceName: string;
  sourceUrl: string;
  sortOrder: number;
  summary: string;
};

type SupabaseImpactMetric = {
  slug: string;
  label: string;
  value_text: string;
  numeric_value: number | null;
  unit: string;
  category: "education" | "healthcare" | "sports" | "cross_cutting";
  is_featured: boolean;
  sort_order: number;
  metric_year: number | null;
  summary: string;
};

type SupabaseContextStat = {
  slug: string;
  label: string;
  value_text: string;
  numeric_value: number | null;
  unit: string;
  scope: string;
  stat_year: number | null;
  source_name: string;
  source_url: string;
  sort_order: number;
  summary: string;
};

/**
 * Map Supabase impact metric record to application format
 */
function mapSupabaseMetric(record: SupabaseImpactMetric): ImpactMetric {
  return {
    slug: record.slug,
    label: record.label,
    value: record.value_text,
    numericValue: record.numeric_value,
    unit: record.unit,
    category: record.category,
    isFeatured: record.is_featured,
    sortOrder: record.sort_order,
    metricYear: record.metric_year,
    summary: record.summary,
  };
}

/**
 * Map Supabase context stat record to application format
 */
function mapSupabaseContextStat(record: SupabaseContextStat): ContextStat {
  return {
    slug: record.slug,
    label: record.label,
    valueText: record.value_text,
    numericValue: record.numeric_value,
    unit: record.unit,
    scope: record.scope,
    statYear: record.stat_year,
    sourceName: record.source_name,
    sourceUrl: record.source_url,
    sortOrder: record.sort_order,
    summary: record.summary,
  };
}

/**
 * Convert fallback hardcoded metrics to the standard format
 */
function mapFallbackMetric(metric: (typeof fallbackImpactMetrics)[0]): ImpactMetric {
  return {
    slug: metric.label.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
    label: metric.label,
    value: metric.value,
    numericValue: null,
    unit: "",
    category: "cross_cutting",
    isFeatured: true,
    sortOrder: 0,
    metricYear: null,
    summary: "",
  };
}

/**
 * Fetch featured impact metrics from Supabase
 * Falls back to hardcoded metrics if Supabase is unavailable
 *
 * @param options - Filter options
 * @param options.category - Filter by category (education, healthcare, sports, cross_cutting)
 * @param options.limit - Maximum number of metrics to return
 * @returns Array of impact metrics sorted by sort_order
 */
export async function getImpactMetrics(options?: {
  category?: string;
  limit?: number;
}): Promise<ImpactMetric[]> {
  const { category, limit } = options || {};

  try {
    if (!hasSupabaseConfig()) {
      return getFallbackMetrics({ limit });
    }

    let query = `is_featured=eq.true&order=sort_order.asc`;

    if (category) {
      query += `&category=eq.${category}`;
    }

    if (limit) {
      query += `&limit=${limit}`;
    }

    const records = await readFromSupabase<SupabaseImpactMetric[]>(
      "impact_metrics",
      query,
    );

    if (!records || records.length === 0) {
      return getFallbackMetrics({ limit });
    }

    return records.map(mapSupabaseMetric);
  } catch (error) {
    console.error("Error fetching impact metrics from Supabase:", error);
    return getFallbackMetrics({ limit });
  }
}

/**
 * Fetch all impact metrics (not just featured)
 */
export async function getAllImpactMetrics(options?: {
  category?: string;
}): Promise<ImpactMetric[]> {
  const { category } = options || {};

  try {
    if (!hasSupabaseConfig()) {
      return getFallbackMetrics();
    }

    let query = `order=sort_order.asc`;

    if (category) {
      query += `&category=eq.${category}`;
    }

    const records = await readFromSupabase<SupabaseImpactMetric[]>(
      "impact_metrics",
      query,
    );

    if (!records || records.length === 0) {
      return getFallbackMetrics();
    }

    return records.map(mapSupabaseMetric);
  } catch (error) {
    console.error("Error fetching all impact metrics:", error);
    return getFallbackMetrics();
  }
}

/**
 * Fetch context stats from Supabase
 * Falls back to hardcoded stats if Supabase is unavailable
 *
 * @param options - Filter options
 * @param options.scope - Filter by scope (e.g., 'kenya')
 * @param options.limit - Maximum number of stats to return
 * @returns Array of context stats sorted by sort_order
 */
export async function getContextStats(options?: {
  scope?: string;
  limit?: number;
}): Promise<ContextStat[]> {
  const { scope = "kenya", limit } = options || {};

  try {
    if (!hasSupabaseConfig()) {
      return getFallbackContextStats({ limit });
    }

    let query = `scope=eq.${scope}&order=sort_order.asc`;

    if (limit) {
      query += `&limit=${limit}`;
    }

    const records = await readFromSupabase<SupabaseContextStat[]>(
      "impact_context_stats",
      query,
    );

    if (!records || records.length === 0) {
      return getFallbackContextStats({ limit });
    }

    return records.map(mapSupabaseContextStat);
  } catch (error) {
    console.error("Error fetching context stats from Supabase:", error);
    return getFallbackContextStats({ limit });
  }
}

/**
 * Get fallback hardcoded impact metrics
 */
function getFallbackMetrics(options?: {
  limit?: number;
}): ImpactMetric[] {
  let metrics = fallbackImpactMetrics.map(mapFallbackMetric);

  if (options?.limit) {
    metrics = metrics.slice(0, options.limit);
  }

  return metrics;
}

/**
 * Get fallback hardcoded context stats
 */
function getFallbackContextStats(options?: {
  limit?: number;
}): ContextStat[] {
  let stats = fallbackContextStats.map((stat) => ({
    slug: stat.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
    label: stat.title,
    valueText: stat.value,
    numericValue: null,
    unit: "",
    scope: "kenya",
    statYear: null,
    sourceName: stat.sourceLabel,
    sourceUrl: stat.sourceUrl,
    sortOrder: 0,
    summary: stat.body,
  }));

  if (options?.limit) {
    stats = stats.slice(0, options.limit);
  }

  return stats;
}
