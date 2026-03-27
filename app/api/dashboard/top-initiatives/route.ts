import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getTopInitiatives } from "@/lib/repositories";

export async function GET() {
  await requireRole(["clerk", "po", "admin"]);
  return NextResponse.json({ data: await getTopInitiatives() });
}
