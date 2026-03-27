import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createInitiative, listInitiatives } from "@/lib/repositories";
import { initiativeSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  await requireRole(["clerk", "po", "admin"]);
  const params = request.nextUrl.searchParams;
  const filters = {
    search: params.get("search"),
    areaId: params.get("areaId"),
    categoryId: params.get("categoryId"),
    mainStatus: params.get("mainStatus"),
    riskStatus: params.get("riskStatus"),
    poFlagStatus: params.get("poFlagStatus"),
    targetYear: params.get("targetYear"),
    isActive: params.get("isActive")
  };
  const data = await listInitiatives(filters);
  return NextResponse.json({ data, meta: { page: 1, pageSize: data.length, totalItems: data.length, totalPages: 1 } });
}

export async function POST(request: Request) {
  await requireRole(["clerk", "po", "admin"]);
  const body = await request.json();
  const parsed = initiativeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid initiative payload", details: parsed.error.flatten() } }, { status: 400 });
  }
  try {
    const created = await createInitiative(parsed.data);
    return NextResponse.json({ data: { id: created.id, initiativeNo: created.initiativeNo } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: { code: "CREATE_FAILED", message: error instanceof Error ? error.message : "Unknown error" } }, { status: 400 });
  }
}
