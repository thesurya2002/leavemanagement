import { redirect } from "next/navigation";
import { requireUser } from "@/lib/server/auth";
import UserAdmin from "@/components/user-admin";

export default async function AdminUsersPage() {
  const user = await requireUser(["ADMIN"]); if (!user) redirect("/dashboard"); return <UserAdmin />;
}
