import { NextResponse } from "next/server";

import { insertIntoSupabase } from "@/lib/supabase-rest";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    amount?: number;
    purpose?: string;
    donorName?: string;
    donorEmail?: string;
  };

  if (!body.amount || !body.donorName || !body.donorEmail) {
    return NextResponse.json(
      { error: "Amount, name, and email are required." },
      { status: 400 },
    );
  }

  try {
    await insertIntoSupabase("donation_intents", {
      amount: body.amount,
      purpose: body.purpose ?? "Support where it's needed most",
      donor_name: body.donorName,
      donor_email: body.donorEmail,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save donation intent right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
