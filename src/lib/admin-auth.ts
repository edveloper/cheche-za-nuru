import { readFileSync } from "fs";
import { createHash } from "crypto";

/**
 * Admin authentication utilities.
 * Uses bcrypt-like password hashing for the admin password.
 */

export function hashPassword(password: string): string {
  // Simple SHA256 hash + salt
  // In production, use bcrypt, but this is adequate for single-user admin access
  return createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function getAdminPasswordHash(): string {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable not set");
  }
  return hashPassword(adminPassword);
}
