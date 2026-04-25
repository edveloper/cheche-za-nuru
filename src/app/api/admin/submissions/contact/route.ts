import { NextResponse } from "next/server";
import { readFromSupabase } from "@/lib/supabase-rest";

type ContactSubmission = {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
  submitted_at: string;
};

export async function GET() {
  try {
    const submissions = await readFromSupabase<ContactSubmission[]>(
      "contact_submissions",
      "order=submitted_at.desc"
    );
    return NextResponse.json({ submissions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load submissions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
