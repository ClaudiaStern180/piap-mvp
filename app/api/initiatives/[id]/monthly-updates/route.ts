import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createMonthlyUpdate, getInitiativeById, listMonthlyUpdates } from "@/lib/repositories";
import { monthlyUpdateSchema } from "@/lib/validation";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const initiative = await getInitiativeById(id);
  if (!initiative) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  const data = await listMonthlyUpdates(id);
  return NextResponse.json({ data });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const initiative = await getInitiativeById(id);
  if (!initiative) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  const body = await request.json();
  const parsed = monthlyUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid monthly update", details: parsed.error.flatten() } }, { status: 400 });
  }
  try {
    const data = await createMonthlyUpdate(id, parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error && error.message === "MONTH_EXISTS" ? "CONFLICT" : "CREATE_FAILED";
    const status = code === "CONFLICT" ? 409 : 400;
    return NextResponse.json({ error: { code, message: error instanceof Error ? error.message : "Unknown error" } }, { status });
  }
}
