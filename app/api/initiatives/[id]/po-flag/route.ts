import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { setPoFlag } from "@/lib/repositories";
import { poFlagSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["po", "admin"]);
  const { id } = await params;
  const body = await request.json();
  const parsed = poFlagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid PO flag", details: parsed.error.flatten() } }, { status: 400 });
  }
  const data = await setPoFlag(id, parsed.data.poFlagStatus, parsed.data.poFlagNote ?? null);
  if (!data) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  return NextResponse.json({ data });
}
