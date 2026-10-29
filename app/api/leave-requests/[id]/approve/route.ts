import "server-only";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const reviewer = await requireUser(["ADMIN", "MANAGER"]); if (!reviewer) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await context.params;
  const found = await prisma.leaveRequest.findUnique({ where: { id } }); if (!found || found.status !== "PENDING") return NextResponse.json({ error: "Leave request not found or already reviewed" }, { status: 404 });
  if (reviewer.role === "MANAGER") {
    const owner = await prisma.user.findUnique({ where: { id: found.userId }, select: { managerId: true } });
    if (!owner || owner.managerId !== reviewer.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.leaveRequest.update({ where: { id }, data: { status: "APPROVED", reviewerId: reviewer.id, reviewedAt: new Date() } });
  await prisma.auditLog.create({ data: { userId: reviewer.id, action: "APPROVE", entity: "LeaveRequest", entityId: id } });
  return NextResponse.json({ ok: true });
}
