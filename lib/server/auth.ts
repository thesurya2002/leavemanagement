import "server-only";
import { getSession } from "./session";
import { prisma } from "./prisma";

export async function requireUser(roles?: Array<"ADMIN" | "MANAGER" | "EMPLOYEE">) {
  const session = await getSession();
  if (!session.userId) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !user.active) return null;
  if (roles && !roles.includes(user.role)) return null;
  return user;
}
