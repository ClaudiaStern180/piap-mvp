import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getPoReview } from "@/lib/repositories";

export async function GET() {
  await requireRole(["po", "admin"]);
  return NextResponse.json({ data: await getPoReview() });
}
