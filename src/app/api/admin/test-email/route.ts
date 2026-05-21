import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  if (!cookie.includes("admin_session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const emailFrom = process.env.EMAIL_FROM ?? "not set";
  const adminEmail = process.env.ADMIN_EMAIL ?? "not set";

  const diagnostics: Record<string, unknown> = {
    email_from: emailFrom,
    admin_email: adminEmail,
    has_service_account_json: !!raw,
    json_parseable: false,
    has_client_email: false,
    has_private_key: false,
    private_key_has_newlines: false,
    email_sent: false,
    error: null,
  };

  if (!raw) {
    diagnostics.error = "GOOGLE_SERVICE_ACCOUNT_JSON is not set";
    return NextResponse.json(diagnostics);
  }

  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(raw) as Record<string, string>;
    diagnostics.json_parseable = true;
    diagnostics.has_client_email = !!parsed.client_email;
    diagnostics.has_private_key = !!parsed.private_key;
    diagnostics.private_key_has_newlines =
      typeof parsed.private_key === "string" && parsed.private_key.includes("\n");
  } catch (e) {
    diagnostics.error = `JSON.parse failed: ${e instanceof Error ? e.message : String(e)}`;
    return NextResponse.json(diagnostics);
  }

  try {
    const sent = await sendEmail({
      to: adminEmail,
      subject: "Cheche Za Nuru — email diagnostic test",
      html: "<p>If you received this, the Gmail API is working correctly on the live site.</p>",
    });
    diagnostics.email_sent = sent;
    if (!sent) {
      diagnostics.error = "sendEmail returned false — Gmail API rejected the request. Check Vercel function logs for the full error.";
    }
  } catch (e) {
    diagnostics.error = `sendEmail threw: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(diagnostics);
}
