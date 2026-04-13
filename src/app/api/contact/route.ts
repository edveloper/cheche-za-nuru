import { NextResponse } from "next/server";

import { insertIntoSupabase } from "@/lib/supabase-rest";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    interest?: string;
    message?: string;
  };

  if (!body.firstName || !body.email || !body.message) {
    return NextResponse.json(
      { error: "First name, email, and message are required." },
      { status: 400 },
    );
  }

  try {
    await insertIntoSupabase("contact_submissions", {
      first_name: body.firstName,
      last_name: body.lastName ?? "",
      email: body.email,
      phone: body.phone ?? "",
      interest: body.interest ?? "",
      message: body.message,
      submitted_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save contact request right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
