import ExcelJS from "exceljs";
import { formatMonth } from "@/lib/format";
import { getInitiativeById, listAttachments, listInitiatives, listLogEntries, listMonthlyUpdates } from "@/lib/repositories";

function styleHeader(row: ExcelJS.Row) {
  row.font = { bold: true };
  row.alignment = { vertical: "middle" };
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" }
    };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF9CA3AF" } }
    };
  });
}

function autoSizeColumns(worksheet: ExcelJS.Worksheet) {
  worksheet.columns?.forEach((column) => {
    let max = 10;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value = cell.value == null ? "" : String(cell.value);
      max = Math.max(max, Math.min(value.length + 2, 40));
    });
    column.width = max;
  });
}

function applyCurrency(cell: ExcelJS.Cell) {
  cell.numFmt = '#,##0.00 [$EUR]';
}

function formatBoolean(value: boolean | null | undefined) {
  if (value == null) return "";
  return value ? "Yes" : "No";
}

export async function buildInitiativesListWorkbook(filters?: Record<string, string | null>) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "OpenAI";
  workbook.created = new Date();
  const worksheet = workbook.addWorksheet("Initiatives");

  const initiatives = await listInitiatives(filters);

  worksheet.columns = [
    { header: "Initiative No", key: "initiativeNo" },
    { header: "Title", key: "title" },
    { header: "Area", key: "area" },
    { header: "Category", key: "category" },
    { header: "Owner", key: "owner" },
    { header: "Sponsor", key: "sponsor" },
    { header: "WSL", key: "wsl" },
    { header: "Main Status", key: "mainStatus" },
    { header: "Risk Status", key: "riskStatus" },
    { header: "PO Flag Status", key: "poFlagStatus" },
    { header: "Planned Savings Total", key: "planned" },
    { header: "Achieved Savings Total", key: "achieved" },
    { header: "Gap", key: "gap" },
    { header: "Currency", key: "currency" },
    { header: "Target Year", key: "targetYear" },
    { header: "Start Date", key: "startDate" },
    { header: "Progress %", key: "progress" },
    { header: "Last Monthly Update", key: "lastMonthlyUpdate" },
    { header: "Active", key: "active" },
    { header: "Updated At", key: "updatedAt" },
  ];

  styleHeader(worksheet.getRow(1));
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = { from: "A1", to: "T1" };

  for (const item of initiatives) {
    const row = worksheet.addRow({
      initiativeNo: item.initiativeNo,
      title: item.title,
      area: item.area.name,
      category: item.category.name,
      owner: item.ownerName,
      sponsor: item.sponsorName ?? "",
      wsl: item.wslName ?? "",
      mainStatus: item.mainStatus ?? "",
      riskStatus: item.riskStatus ?? "",
      poFlagStatus: item.poFlagStatus,
      planned: item.plannedSavingsTotal,
      achieved: item.achievedSavingsTotal,
      gap: item.plannedSavingsTotal - item.achievedSavingsTotal,
      currency: item.currencyCode,
      targetYear: item.targetYear,
      startDate: item.startDate ?? "",
      progress: item.implementationProgressPct ?? "",
      lastMonthlyUpdate: item.lastMonthlyUpdate ? formatMonth(item.lastMonthlyUpdate.reportingYear, item.lastMonthlyUpdate.reportingMonth) : "",
      active: item.isActive ? "Yes" : "No",
      updatedAt: item.updatedAt,
    });
    applyCurrency(row.getCell("planned"));
    applyCurrency(row.getCell("achieved"));
    applyCurrency(row.getCell("gap"));
  }

  autoSizeColumns(worksheet);
  return workbook;
}

export async function buildInitiativeDetailWorkbook(initiativeId: string) {
  const initiative = await getInitiativeById(initiativeId);
  if (!initiative) return null;

  const updates = await listMonthlyUpdates(initiativeId);
  const logEntries = await listLogEntries(initiativeId);
  const attachmentItems = await listAttachments(initiativeId);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "OpenAI";
  workbook.created = new Date();

  const overview = workbook.addWorksheet("Overview");
  overview.columns = [{ key: "label", width: 28 }, { key: "value", width: 40 }];
  overview.addRow(["Field", "Value"]);
  styleHeader(overview.getRow(1));
  overview.views = [{ state: "frozen", ySplit: 1 }];

  const overviewRows: Array<[string, string | number | boolean | null]> = [
    ["Initiative No", initiative.initiativeNo],
    ["Title", initiative.title],
    ["Description", initiative.description],
    ["Area", initiative.area.name],
    ["Category", initiative.category.name],
    ["Owner", initiative.ownerName],
    ["Sponsor", initiative.sponsorName],
    ["WSL", initiative.wslName],
    ["Main Status", initiative.mainStatus],
    ["Risk Status", initiative.riskStatus],
    ["PO Flag Status", initiative.poFlagStatus],
    ["PO Flag Note", initiative.poFlagNote],
    ["Planned Savings Total", initiative.plannedSavingsTotal],
    ["Achieved Savings Total", initiative.achievedSavingsTotal],
    ["Gap", initiative.plannedSavingsTotal - initiative.achievedSavingsTotal],
    ["Approved Savings", initiative.approvedSavings],
    ["Investment Amount", initiative.investmentAmount],
    ["Currency", initiative.currencyCode],
    ["Saving Type", initiative.savingType],
    ["Impact on OI", formatBoolean(initiative.impactOnOi)],
    ["Start Date", initiative.startDate],
    ["Target Year", initiative.targetYear],
    ["Progress %", initiative.implementationProgressPct],
    ["Risk Text", initiative.riskText],
    ["Mitigation Text", initiative.mitigationText],
    ["Next Steps", initiative.nextSteps],
    ["Management Comment", initiative.managementComment],
    ["Active", formatBoolean(initiative.isActive)],
    ["Updated At", initiative.updatedAt],
  ];

  overviewRows.forEach(([label, value]) => {
    const row = overview.addRow([label, value ?? ""]);
    if (["Planned Savings Total", "Achieved Savings Total", "Gap", "Approved Savings", "Investment Amount"].includes(String(label))) {
      applyCurrency(row.getCell(2));
    }
  });

  const updatesSheet = workbook.addWorksheet("Monthly Updates");
  updatesSheet.columns = [
    { header: "Reporting Year", key: "reportingYear" },
    { header: "Reporting Month", key: "reportingMonth" },
    { header: "Planned Savings Month", key: "planned" },
    { header: "Achieved Savings Month", key: "achieved" },
    { header: "Gap Month", key: "gap" },
    { header: "Main Status", key: "mainStatus" },
    { header: "Risk Status", key: "riskStatus" },
    { header: "Progress %", key: "progress" },
    { header: "Comment", key: "comment" },
    { header: "Risk", key: "risk" },
    { header: "Mitigation", key: "mitigation" },
    { header: "Next Steps", key: "nextSteps" },
    { header: "Updated At", key: "updatedAt" },
  ];
  styleHeader(updatesSheet.getRow(1));
  updatesSheet.views = [{ state: "frozen", ySplit: 1 }];
  updates.forEach((update) => {
    const row = updatesSheet.addRow({
      reportingYear: update.reportingYear,
      reportingMonth: update.reportingMonth,
      planned: update.plannedSavingsMonth ?? 0,
      achieved: update.achievedSavingsMonth ?? 0,
      gap: (update.plannedSavingsMonth ?? 0) - (update.achievedSavingsMonth ?? 0),
      mainStatus: update.mainStatus ?? "",
      riskStatus: update.riskStatus ?? "",
      progress: update.implementationProgressPct ?? "",
      comment: update.commentText ?? "",
      risk: update.riskText ?? "",
      mitigation: update.mitigationText ?? "",
      nextSteps: update.nextSteps ?? "",
      updatedAt: update.updatedAt,
    });
    applyCurrency(row.getCell("planned"));
    applyCurrency(row.getCell("achieved"));
    applyCurrency(row.getCell("gap"));
  });

  const commentsSheet = workbook.addWorksheet("Comments & Actions");
  commentsSheet.columns = [
    { header: "Entry Type", key: "entryType" },
    { header: "Text", key: "text" },
    { header: "Owner Name", key: "ownerName" },
    { header: "Due Date", key: "dueDate" },
    { header: "Status", key: "status" },
    { header: "Created At", key: "createdAt" },
  ];
  styleHeader(commentsSheet.getRow(1));
  commentsSheet.views = [{ state: "frozen", ySplit: 1 }];
  logEntries.forEach((entry) => commentsSheet.addRow({
    entryType: entry.entryType,
    text: entry.text,
    ownerName: entry.ownerName ?? "",
    dueDate: entry.dueDate ?? "",
    status: entry.status ?? "",
    createdAt: entry.createdAt,
  }));

  const attachmentsSheet = workbook.addWorksheet("Attachments");
  attachmentsSheet.columns = [
    { header: "File Name", key: "fileName" },
    { header: "Mime Type", key: "mimeType" },
    { header: "File Size Bytes", key: "fileSizeBytes" },
    { header: "Uploaded By", key: "uploadedBy" },
    { header: "Created At", key: "createdAt" },
  ];
  styleHeader(attachmentsSheet.getRow(1));
  attachmentsSheet.views = [{ state: "frozen", ySplit: 1 }];
  attachmentItems.forEach((item) => attachmentsSheet.addRow({
    fileName: item.fileName,
    mimeType: item.mimeType ?? "",
    fileSizeBytes: item.fileSizeBytes,
    uploadedBy: item.uploadedBy.name,
    createdAt: item.createdAt,
  }));

  [overview, updatesSheet, commentsSheet, attachmentsSheet].forEach(autoSizeColumns);
  return workbook;
}
