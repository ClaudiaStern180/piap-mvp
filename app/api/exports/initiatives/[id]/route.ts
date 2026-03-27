import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { buildInitiativeDetailWorkbook } from "@/lib/export";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["clerk", "po", "admin"]);
  const { id } = await params;
  const workbook = await buildInitiativeDetailWorkbook(id);
  if (!workbook) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Initiative not found" } }, { status: 404 });
  }
  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `initiative-${id}.xlsx`;

  return new NextResponse(buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
