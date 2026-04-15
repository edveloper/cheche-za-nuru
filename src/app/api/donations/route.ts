import { NextResponse } from "next/server";

import { insertIntoSupabase } from "@/lib/supabase-rest";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    amount?: number;
    purpose?: string;
    fundId?: string | null;
    donorName?: string;
    donorEmail?: string;
    donorPhone?: string;
    donorMessage?: string;
    isRecurring?: boolean;
    recurrence?: string;
    website?: string;
  };

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  if (!body.amount || !body.donorName || !body.donorEmail) {
    return NextResponse.json(
      { error: "Amount, name, and email are required." },
      { status: 400 },
    );
  }

  try {
    await insertIntoSupabase("donation_intents", {
      amount: body.amount,
      purpose: body.purpose ?? "Support where it is needed most",
      fund_id: body.fundId ?? null,
      donor_name: body.donorName,
      donor_email: body.donorEmail,
      donor_phone: body.donorPhone ?? "",
      donor_message: body.donorMessage ?? "",
      is_recurring: body.isRecurring ?? false,
      recurrence: body.recurrence ?? "one_time",
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
