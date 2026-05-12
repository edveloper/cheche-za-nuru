import { NextResponse } from "next/server";

import { insertIntoSupabase } from "@/lib/supabase-rest";
import {
  sendInvolvementConfirmation,
  sendInvolvementAdminNotification,
} from "@/lib/email-service";

const allowedInterestTypes = new Set([
  "donate",
  "volunteer",
  "partner",
  "sponsor",
  "in_kind",
  "media",
  "other",
]);

const interestLabels: Record<string, string> = {
  donate: "Donation",
  volunteer: "Volunteering",
  partner: "Partnership",
  sponsor: "Sponsorship",
  in_kind: "In-kind Support",
  media: "Media Support",
  other: "Other",
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    interestType?: string;
    organizationName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    location?: string;
    supportArea?: string;
    budgetRange?: string;
    message?: string;
    website?: string;
  };

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  if (
    !body.contactName ||
    !body.email ||
    !body.interestType ||
    !allowedInterestTypes.has(body.interestType)
  ) {
    return NextResponse.json(
      { error: "Interest type, contact name, and email are required." },
      { status: 400 },
    );
  }

  try {
    await insertIntoSupabase("involvement_leads", {
      interest_type: body.interestType,
      organization_name: body.organizationName ?? "",
      contact_name: body.contactName,
      email: body.email,
      phone: body.phone ?? "",
      location: body.location ?? "",
      support_area: body.supportArea ?? "",
      budget_range: body.budgetRange ?? "",
      message: body.message ?? "",
      submitted_at: new Date().toISOString(),
    });

    // Send confirmation email to submitter
    const interestLabel =
      interestLabels[body.interestType] || body.interestType;
    await sendInvolvementConfirmation(
      body.contactName,
      body.email,
      interestLabel
    );

    // Send admin notification
    await sendInvolvementAdminNotification(
      body.contactName,
      body.email,
      body.phone || null,
      interestLabel,
      body.message || null
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save involvement request right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
