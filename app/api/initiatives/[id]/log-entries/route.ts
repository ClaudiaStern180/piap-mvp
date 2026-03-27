import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createLogEntry, getInitiativeById, listLogEntries } from "@/lib/repositories";
import { logEntrySchema } from "@/lib/validation";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const initiative = await getInitiativeById(id);
  if (!initiative) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  return NextResponse.json({ data: await listLogEntries(id) });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const initiative = await getInitiativeById(id);
  if (!initiative) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  const body = await request.json();
  const parsed = logEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid log entry", details: parsed.error.flatten() } }, { status: 400 });
  }
  return NextResponse.json({ data: await createLogEntry(id, parsed.data) }, { status: 201 });
}
