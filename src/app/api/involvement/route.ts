import { NextResponse } from "next/server";

import { insertIntoSupabase } from "@/lib/supabase-rest";

const allowedInterestTypes = new Set([
  "donate",
  "volunteer",
  "partner",
  "sponsor",
  "in_kind",
  "media",
  "other",
]);

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

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save involvement request right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
