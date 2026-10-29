import "server-only";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { hashPassword } from "@/lib/server/password";
import { createUserSchema, normalizeEmail } from "@/lib/shared/validation";

export async function GET() {
  const admin = await requireUser(["ADMIN"]); if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ users: await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, active: true, managerId: true }, orderBy: { name: "asc" } }) });
}

export async function POST(request: Request) {
  const admin = await requireUser(["ADMIN"]); if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = createUserSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid user", issues: parsed.error.issues }, { status: 400 });
  const email = normalizeEmail(parsed.data.email);
  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({ data: { name: parsed.data.name, email, passwordHash, role: parsed.data.role, managerId: parsed.data.managerId || null }, select: { id: true, name: true, email: true, role: true, active: true } });
  await prisma.auditLog.create({ data: { userId: admin.id, action: "CREATE", entity: "User", entityId: user.id } });
  return NextResponse.json({ user }, { status: 201 });
}
