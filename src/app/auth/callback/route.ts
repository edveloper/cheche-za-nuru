import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  // Handle auth errors (expired links, etc.)
  if (error) {
    const errorMessage = error_description
      ? `${error}: ${decodeURIComponent(error_description)}`
      : error;

    console.error("Auth callback error:", errorMessage);

    return NextResponse.redirect(
      new URL(
        `/auth/error?error=${encodeURIComponent(errorMessage)}`,
        request.url,
      ),
    );
  }

  // Exchange authorization code for session
  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Session exchange error:", exchangeError.message);

      return NextResponse.redirect(
        new URL(
          `/auth/error?error=${encodeURIComponent(exchangeError.message)}`,
          request.url,
        ),
      );
    }
  }

  // Success - redirect to home
  return NextResponse.redirect(new URL("/", request.url));
}
