import "server-only";
import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/shared/validation";
import { prisma } from "@/lib/server/prisma";
import { verifyPassword } from "@/lib/server/password";
import { getSession } from "@/lib/server/session";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.active || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const session = await getSession();
  session.userId = user.id;
  session.role = user.role;
  await session.save();
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
