import { z } from "zod";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const loginSchema = z.object({
  email: z.string().trim().email().transform(normalizeEmail),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform(normalizeEmail),
  password: z.string().min(8).max(72),
  role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]),
  managerId: z.string().optional().nullable(),
});

export const leaveRequestSchema = z.object({
  leaveType: z.enum(["ANNUAL", "SICK", "PERSONAL", "UNPAID"]),
  startDate: z.string().date(),
  endDate: z.string().date(),
  reason: z.string().trim().min(3).max(500),
}).refine((value) => value.endDate >= value.startDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});
