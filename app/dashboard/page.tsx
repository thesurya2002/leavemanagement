import { redirect } from "next/navigation";
import { requireUser } from "@/lib/server/auth";
import LeaveDashboard from "@/components/leave-dashboard";

export default async function DashboardPage() {
  const user = await requireUser(); if (!user) redirect("/login"); return <LeaveDashboard role={user.role} />;
}
