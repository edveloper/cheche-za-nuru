import { NextResponse } from "next/server";
import { readFromSupabase } from "@/lib/supabase-rest";

type DonationIntent = {
  id: string;
  reference_code: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: string;
  currency: string;
  purpose: string;
  fund_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export async function GET() {
  try {
    const intents = await readFromSupabase<DonationIntent[]>(
      "donation_intents",
      "order=created_at.desc"
    );

    return NextResponse.json({ intents });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load donation intents";
    console.error("[Admin Donations GET]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
