import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { archiveInitiative, getInitiativeById, updateInitiative } from "@/lib/repositories";
import { initiativeSchema } from "@/lib/validation";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const data = await getInitiativeById(id);
  if (!data) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const body = await request.json();
  const parsed = initiativeSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid initiative payload", details: parsed.error.flatten() } }, { status: 400 });
  }
  const data = await updateInitiative(id, parsed.data);
  if (!data) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  return NextResponse.json({ data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["po", "admin"]);
  const { id } = await params;
  const data = await archiveInitiative(id);
  if (!data) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  return NextResponse.json({ data });
}
