import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { listAreas } from "@/lib/repositories";

export async function GET() {
  await requireRole(["clerk", "po", "admin"]);
  return NextResponse.json({ data: await listAreas() });
}

export async function POST(request: Request) {
  await requireRole(["admin"]);
  const body = await request.json();
  return NextResponse.json({ data: { ...body, id: crypto.randomUUID() } }, { status: 201 });
}
