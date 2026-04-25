import { NextResponse } from "next/server";
import { readFromSupabase } from "@/lib/supabase-rest";

type InvolvementLead = {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  interest: string;
  message?: string;
  submitted_at: string;
};

export async function GET() {
  try {
    const leads = await readFromSupabase<InvolvementLead[]>(
      "involvement_leads",
      "order=submitted_at.desc"
    );
    return NextResponse.json({ leads });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load leads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
