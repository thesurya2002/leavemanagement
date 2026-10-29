import "server-only";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/session";

export async function POST() {
  const session = await getSession();
  session.destroy();
  await session.save();
  return NextResponse.json({ ok: true });
}
