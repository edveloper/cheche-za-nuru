"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

/**
 * Handles Supabase auth flows via hash fragments:
 * 1. Successful auth: Detects tokens (access_token, refresh_token) and sets session
 * 2. Auth errors: Detects errors (error, error_description) and redirects to error page
 * 
 * Supabase uses hash fragments for these because they're client-side only.
 */
export function AuthErrorHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    // Parse hash parameters
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    // Handle successful auth (invite/signup/signin flow)
    if (accessToken && refreshToken) {
      console.log("Auth tokens detected, setting session...");

      // Set the session with the tokens Supabase provided
      supabaseClient.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .then(({ data, error: sessionError }) => {
          if (sessionError) {
            console.error("Failed to set session:", sessionError.message);
            router.push(`/auth/error?error=${encodeURIComponent(sessionError.message)}`);
          } else {
            console.log("Session set successfully, user:", data.user?.email);
            // Clear hash and redirect to home
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push("/");
          }
        });
      return;
    }

    // Handle auth errors
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
