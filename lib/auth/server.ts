import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";
import { io } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminUser } from "./policy";

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Neon Auth is not configured: set the server-only ${name} environment variable.`,
    );
  }

  return value;
}

const baseUrl = requiredEnvironmentVariable("NEON_AUTH_BASE_URL");
const cookieSecret = requiredEnvironmentVariable("NEON_AUTH_COOKIE_SECRET");

if (cookieSecret.length < 32) {
  throw new Error(
    "Neon Auth is not configured: NEON_AUTH_COOKIE_SECRET must be at least 32 characters.",
  );
}

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
  },
});

export async function getAuthenticatedUser() {
  // Session cookies only exist at request time. Suspend prerendering before
  // entering Neon Auth so Cache Components keeps this work out of the shell.
  await io();
  const { data, error } = await auth.getSession();

  if (error) {
    throw new Error("Unable to verify the current authentication session.");
  }

  return data?.user ?? null;
}

export function isConfiguredAdmin(userId: string): boolean {
  return isAdminUser(userId, process.env.ADMIN_USER_ID);
}

/**
 * Enforce owner authorization next to protected reads and writes. Proxy only
 * performs the earlier authentication check and is not an authorization
 * boundary.
 */
export async function requireAdmin() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (!isConfiguredAdmin(user.id)) {
    redirect("/auth/access-denied");
  }

  return user;
}
