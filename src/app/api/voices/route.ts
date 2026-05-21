import { NextResponse } from "next/server";
import { insertIntoSupabase } from "@/lib/supabase-rest";
import { sendEmail } from "@/lib/email-service";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@chechezanurufoundation.org";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { display_name, role_label, location, quote, website } = body;

    // Honeypot — bots fill hidden fields, humans don't
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!display_name?.trim() || !quote?.trim()) {
      return NextResponse.json(
        { error: "Name and quote are required" },
        { status: 400 }
      );
    }

    if (quote.trim().length > 600) {
      return NextResponse.json(
        { error: "Quote must be 600 characters or fewer" },
        { status: 400 }
      );
    }

    await insertIntoSupabase("voice_submissions", {
      display_name: display_name.trim(),
      role_label: role_label?.trim() ?? "",
      location: location?.trim() ?? "",
      quote: quote.trim(),
      status: "pending",
      created_at: new Date().toISOString(),
    });

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New voice submission from ${display_name.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #f5c11a;">New Voice Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 10px;">${display_name.trim()}</td>
            </tr>
            ${role_label?.trim() ? `<tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">Role:</td>
              <td style="padding: 10px;">${role_label.trim()}</td>
            </tr>` : ""}
            ${location?.trim() ? `<tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold;">Location:</td>
              <td style="padding: 10px;">${location.trim()}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">Quote:</td>
              <td style="padding: 10px; font-style: italic;">&ldquo;${quote.trim()}&rdquo;</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Review and approve this submission in the admin dashboard.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
