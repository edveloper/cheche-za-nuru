import { NextResponse } from "next/server";

import { insertIntoSupabase } from "@/lib/supabase-rest";
import {
  sendDonationConfirmation,
  sendDonationAdminNotification,
} from "@/lib/email-service";
import { readFromSupabase } from "@/lib/supabase-rest";

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
    const insertResult = await insertIntoSupabase("donation_intents", {
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

    // Get fund name if fundId is provided
    let fundName: string | null = null;
    if (body.fundId) {
      try {
        const funds = (await readFromSupabase("donation_funds", {
          filter: `id=eq.${body.fundId}`,
        })) as Array<{ name: string }>;
        fundName = funds.length > 0 ? funds[0].name : null;
      } catch (e) {
        console.error("[Donations] Failed to fetch fund name:", e);
      }
    }

    // Send confirmation email to donor
    await sendDonationConfirmation(
      body.donorName,
      body.donorEmail,
      body.amount.toString(),
      "USD", // Adjust if you support multiple currencies
      fundName
    );

    // Send admin notification
    await sendDonationAdminNotification(
      body.donorName,
      body.donorEmail,
      body.donorPhone || null,
      body.amount.toString(),
      "USD", // Adjust if you support multiple currencies
      fundName
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save donation intent right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
