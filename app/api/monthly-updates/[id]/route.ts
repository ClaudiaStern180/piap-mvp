import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { deleteMonthlyUpdate, updateMonthlyUpdate } from "@/lib/repositories";
import { monthlyUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const body = await request.json();
  const parsed = monthlyUpdateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid monthly update", details: parsed.error.flatten() } }, { status: 400 });
  }
  const data = await updateMonthlyUpdate(id, parsed.data);
  if (!data) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Monthly update not found" } }, { status: 404 });
  return NextResponse.json({ data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["po", "admin"]);
  const { id } = await params;
  const ok = await deleteMonthlyUpdate(id);
  if (!ok) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Monthly update not found" } }, { status: 404 });
  return NextResponse.json({ data: { success: true } });
}
