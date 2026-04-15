import { NextResponse } from "next/server";

import { fallbackDonationFunds } from "@/lib/donation-funds";
import { hasSupabaseConfig, readFromSupabase } from "@/lib/supabase-rest";

type DonationFundRecord = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  impact_summary: string;
};

export async function GET() {
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ funds: fallbackDonationFunds });
  }

  try {
    const funds = await readFromSupabase<DonationFundRecord[]>(
      "donation_funds",
      [
        "select=id,slug,name,short_description,impact_summary",
        "is_active=eq.true",
        "order=sort_order.asc",
      ].join("&"),
    );

    if (!funds.length) {
      return NextResponse.json({ funds: fallbackDonationFunds });
    }

    return NextResponse.json({
      funds: funds.map((fund) => ({
        id: fund.id,
        slug: fund.slug,
        name: fund.name,
        shortDescription: fund.short_description,
        impactSummary: fund.impact_summary,
      })),
    });
  } catch {
    return NextResponse.json({ funds: fallbackDonationFunds });
  }
}
