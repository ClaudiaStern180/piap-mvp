import { cookies, headers } from "next/headers";
import { User } from "@/lib/types";

const mockUsers: Record<string, User> = {
  clerk: {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Clerk User",
    email: "clerk@example.com",
    role: "clerk",
    preferredLanguage: "en",
    isActive: true,
  },
  po: {
    id: "22222222-2222-2222-2222-222222222222",
    name: "PO User",
    email: "po@example.com",
    role: "po",
    preferredLanguage: "en",
    isActive: true,
  },
  admin: {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    preferredLanguage: "en",
    isActive: true,
  },
};

export async function getCurrentUser(): Promise<User | null> {
  const hdrs = await headers();
  const cookieStore = await cookies();
  const headerRole = hdrs.get("x-demo-role");
  const cookieRole = cookieStore.get("demo_role")?.value;
  const role = headerRole || cookieRole;
  if (!role) return null;
  return mockUsers[role] ?? null;
}

export async function getCurrentUserOrThrow(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

export async function requireRole(roles: User["role"][]): Promise<User> {
  const user = await getCurrentUserOrThrow();
  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export function getDemoUserByRole(role: string) {
  return mockUsers[role] ?? null;
}
