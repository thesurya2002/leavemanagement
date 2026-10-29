import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export const sessionCookieName = "lms_session";
export type SessionData = { userId?: string; role?: "ADMIN" | "MANAGER" | "EMPLOYEE" };

export const sessionOptions: SessionOptions = {
  cookieName: sessionCookieName,
  password: process.env.SESSION_PASSWORD || "development-only-password-that-is-at-least-32-characters",
  cookieOptions: { secure: process.env.NODE_ENV === "production", httpOnly: true, sameSite: "lax", path: "/" },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
