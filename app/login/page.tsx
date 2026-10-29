"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/shared/validation";

export default function LoginPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); const form = new FormData(event.currentTarget);
    const input = { email: String(form.get("email")), password: String(form.get("password")) };
    const parsed = loginSchema.safeParse(input); if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Invalid input"); return; }
    setLoading(true); const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    setLoading(false); if (!response.ok) { setError("Invalid email or password"); return; } router.push("/dashboard"); router.refresh();
  }
  return <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6"><form onSubmit={submit} className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"><h1 className="mb-6 text-2xl font-bold text-blue-700">Sign in to LMS</h1>{error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium">Email<input name="email" type="email" required className="mt-1 mb-4 w-full rounded border px-3 py-2" /></label><label className="block text-sm font-medium">Password<input name="password" type="password" required className="mt-1 w-full rounded border px-3 py-2" /></label><button disabled={loading} className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">{loading ? "Signing in..." : "Sign in"}</button></form></main>;
}
