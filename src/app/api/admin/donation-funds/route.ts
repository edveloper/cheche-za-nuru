import { NextResponse, NextRequest } from "next/server";
import { readFromSupabase, insertIntoSupabase, updateSupabase, deleteFromSupabase } from "@/lib/supabase-rest";

type DonationFund = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  impact_summary: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function GET() {
  try {
    const funds = await readFromSupabase<DonationFund[]>(
      "donation_funds",
      "order=sort_order.asc"
    );
    return NextResponse.json({ funds });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load donation funds";
    console.error("[Donation Funds GET]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name, short_description, impact_summary, is_active, sort_order } = body;

    // Validation
    if (!slug || !name) {
      return NextResponse.json(
        { error: "Slug and name are required" },
        { status: 400 }
      );
    }

    const result = await insertIntoSupabase("donation_funds", {
      slug,
      name,
      short_description: short_description || "",
      impact_summary: impact_summary || "",
      is_active: is_active !== false,
      sort_order: sort_order || 0,
    });

    return NextResponse.json({
      success: true,
      message: "Donation fund created",
      fund: result[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create donation fund";
    console.error("[Donation Funds POST]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name, short_description, impact_summary, is_active, sort_order } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: "Slug and name are required" },
        { status: 400 }
      );
    }

    const result = await updateSupabase(
      "donation_funds",
      `slug=eq.${slug}`,
      {
        name,
        short_description: short_description || "",
        impact_summary: impact_summary || "",
        is_active: is_active !== false,
        sort_order: sort_order || 0,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Donation fund updated",
      fund: result[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update donation fund";
    console.error("[Donation Funds PUT]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
