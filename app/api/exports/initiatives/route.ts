import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { buildInitiativesListWorkbook } from "@/lib/export";

export async function GET(request: Request) {
  await requireRole(["clerk", "po", "admin"]);
  const url = new URL(request.url);
  const filters = {
    search: url.searchParams.get("search"),
    areaId: url.searchParams.get("areaId"),
    categoryId: url.searchParams.get("categoryId"),
    owner: url.searchParams.get("owner"),
    mainStatus: url.searchParams.get("mainStatus"),
    riskStatus: url.searchParams.get("riskStatus"),
    poFlagStatus: url.searchParams.get("poFlagStatus"),
    targetYear: url.searchParams.get("targetYear"),
    isActive: url.searchParams.get("isActive"),
  };

  const workbook = await buildInitiativesListWorkbook(filters);
  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `initiatives-export-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
