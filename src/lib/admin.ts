import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side check for admin access.
 * Redirects to home page if user is not authenticated or not an admin.
 *
 * @returns The session object if user is an admin
 * @throws Redirects to home page if not admin
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  if (session.user.platformRole !== "admin") {
    redirect("/");
  }

  return session;
}

/**
 * Checks if the current user is an admin.
 * For use in API routes where you need to check admin status.
 *
 * @returns The session if user is admin, null otherwise
 */
export async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  if (session.user.platformRole !== "admin") {
    return null;
  }

  return session;
}
