"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminPasswordHash, verifyPassword } from "@/lib/admin-auth";

export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required" };
  }

  const adminHash = getAdminPasswordHash();
  const isValid = verifyPassword(password, adminHash);

  if (!isValid) {
    return { error: "Invalid password" };
  }

  // Set admin session cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/admin/dashboard");
}
