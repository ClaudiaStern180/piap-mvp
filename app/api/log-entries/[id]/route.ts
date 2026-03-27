import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { updateLogEntry } from "@/lib/repositories";
import { logEntrySchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const body = await request.json();
  const parsed = logEntrySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid log entry", details: parsed.error.flatten() } }, { status: 400 });
  }
  const data = await updateLogEntry(id, parsed.data);
  if (!data) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Log entry not found" } }, { status: 404 });
  return NextResponse.json({ data });
}
