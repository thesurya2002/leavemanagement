import "server-only";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { leaveRequestSchema } from "@/lib/shared/validation";

export async function GET() {
  const user = await requireUser(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const where = user.role === "EMPLOYEE" ? { userId: user.id } : user.role === "MANAGER" ? { OR: [{ userId: user.id }, { user: { managerId: user.id } }] } : {};
  const requests = await prisma.leaveRequest.findMany({ where, include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  const user = await requireUser(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = leaveRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid leave request", issues: parsed.error.issues }, { status: 400 });
  const startDate = new Date(`${parsed.data.startDate}T00:00:00.000Z`);
  const endDate = new Date(`${parsed.data.endDate}T00:00:00.000Z`);
  const days = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1);
  const leave = await prisma.leaveRequest.create({ data: { userId: user.id, leaveType: parsed.data.leaveType, startDate, endDate, reason: parsed.data.reason } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "CREATE", entity: "LeaveRequest", entityId: leave.id, metadata: { leaveType: parsed.data.leaveType, days } } });
  return NextResponse.json({ request: leave }, { status: 201 });
}
