"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Handles Supabase auth errors in hash fragments.
 * Supabase redirects with errors using #error=... format, which are client-side only.
 * This component intercepts those and redirects to the error page.
 */
export function AuthErrorHandler() {
  const router = useRouter();

  useEffect(() => {
    // Check for auth errors in hash fragment
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash.includes("error")) return;

    // Parse hash parameters
    const params = new URLSearchParams(hash.substring(1));
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      const errorMessage = errorDescription
        ? `${error}: ${decodeURIComponent(errorDescription)}`
        : error;

      console.error("Auth error detected:", errorMessage);

      // Redirect to error page
      router.push(`/auth/error?error=${encodeURIComponent(errorMessage)}`);
    }
  }, [router]);

  return null;
}
