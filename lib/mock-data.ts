import { Attachment, InitiativeDetail, LogEntry, MonthlyUpdate, SelectOption, User } from "@/lib/types";

export const users: User[] = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Max Mustermann", email: "max@example.com", role: "admin", preferredLanguage: "de", isActive: true },
  { id: "22222222-2222-2222-2222-222222222222", name: "Anna PO", email: "anna@example.com", role: "po", preferredLanguage: "en", isActive: true }
];

export const areas: SelectOption[] = [
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1", nameDe: "Bereich A", nameEn: "Area A", code: "AREA_A", sortOrder: 10, isActive: true },
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2", nameDe: "Bereich B", nameEn: "Area B", code: "AREA_B", sortOrder: 20, isActive: true },
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3", nameDe: "Bereich C", nameEn: "Area C", code: "AREA_C", sortOrder: 30, isActive: true },
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4", nameDe: "Werk 1", nameEn: "Plant 1", code: "PLANT_1", sortOrder: 40, isActive: true },
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5", nameDe: "Werk 2", nameEn: "Plant 2", code: "PLANT_2", sortOrder: 50, isActive: true }
];

export const categories: SelectOption[] = [
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1", nameDe: "Logistik", nameEn: "Logistics", code: "LOGISTICS", sortOrder: 10, isActive: true },
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2", nameDe: "Qualität", nameEn: "Quality", code: "QUALITY", sortOrder: 20, isActive: true },
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3", nameDe: "Produktion", nameEn: "Production", code: "PRODUCTION", sortOrder: 30, isActive: true },
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4", nameDe: "Einkauf", nameEn: "Purchase", code: "PURCHASE", sortOrder: 40, isActive: true },
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5", nameDe: "OPEX", nameEn: "OPEX", code: "OPEX", sortOrder: 50, isActive: true }
];

export const initiatives: InitiativeDetail[] = [
  {
    id: "cccccccc-cccc-cccc-cccc-ccccccccccc1",
    initiativeNo: 1001,
    title: "Reduce Scrap on Line 2",
    description: "Improvement initiative for scrap reduction.",
    area: { id: areas[0].id, name: areas[0].nameEn },
    category: { id: categories[2].id, name: categories[2].nameEn },
    ownerName: "John Doe",
    sponsorName: "Jane Doe",
    wslName: "Tom Smith",
    mainStatus: "IL3",
    riskStatus: "yellow",
    poFlagStatus: "review_required",
    plannedSavingsTotal: 250000,
    achievedSavingsTotal: 80000,
    currencyCode: "EUR",
    lastMonthlyUpdate: { reportingYear: 2026, reportingMonth: 2, updatedAt: "2026-02-28T16:02:11Z" },
    updatedAt: "2026-03-01T10:12:45Z",
    isActive: true,
    implementationProgressPct: 65,
    startDate: "2026-03-01",
    targetYear: 2026,
    approvedSavings: 50000,
    investmentAmount: 20000,
    savingType: "Recurring",
    impactOnOi: true,
    riskText: "Ramp-up slower than expected",
    mitigationText: "Additional technical support planned",
    nextSteps: "Implement second machine test",
    managementComment: "",
    poFlagNote: "Need management attention in next review"
  },
  {
    id: "cccccccc-cccc-cccc-cccc-ccccccccccc2",
    initiativeNo: 1002,
    title: "Energy Reduction in Paint Shop",
    description: "Optimize oven cycle and compressed air usage.",
    area: { id: areas[3].id, name: areas[3].nameEn },
    category: { id: categories[4].id, name: categories[4].nameEn },
    ownerName: "Jane Smith",
    sponsorName: "Alan Green",
    wslName: null,
    mainStatus: "IL2",
    riskStatus: "green",
    poFlagStatus: "none",
    plannedSavingsTotal: 300000,
    achievedSavingsTotal: 120000,
    currencyCode: "EUR",
    lastMonthlyUpdate: { reportingYear: 2026, reportingMonth: 2, updatedAt: "2026-02-26T11:00:00Z" },
    updatedAt: "2026-02-26T11:00:00Z",
    isActive: true,
    implementationProgressPct: 45,
    startDate: "2026-01-10",
    targetYear: 2026,
    approvedSavings: 100000,
    investmentAmount: 35000,
    savingType: "Recurring",
    impactOnOi: false,
    riskText: null,
    mitigationText: null,
    nextSteps: "Finalize capex request",
    managementComment: null,
    poFlagNote: null
  }
];

export const monthlyUpdates: MonthlyUpdate[] = [
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddd1",
    initiativeId: initiatives[0].id,
    reportingYear: 2026,
    reportingMonth: 1,
    plannedSavingsMonth: 30000,
    achievedSavingsMonth: 25000,
    mainStatus: "IL3",
    riskStatus: "yellow",
    implementationProgressPct: 60,
    commentText: "Start-up phase completed",
    riskText: "Minor delay in supplier release",
    mitigationText: "Expedite supplier follow-up",
    nextSteps: "Stabilize process",
    updatedAt: "2026-01-31T18:00:00Z"
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddd2",
    initiativeId: initiatives[0].id,
    reportingYear: 2026,
    reportingMonth: 2,
    plannedSavingsMonth: 50000,
    achievedSavingsMonth: 55000,
    mainStatus: "IL3",
    riskStatus: "yellow",
    implementationProgressPct: 65,
    commentText: "Improved output",
    riskText: "Ramp-up slower than expected",
    mitigationText: "Additional technical support planned",
    nextSteps: "Implement second machine test",
    updatedAt: "2026-02-28T16:02:11Z"
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddd3",
    initiativeId: initiatives[1].id,
    reportingYear: 2026,
    reportingMonth: 1,
    plannedSavingsMonth: 60000,
    achievedSavingsMonth: 50000,
    mainStatus: "IL2",
    riskStatus: "green",
    implementationProgressPct: 35,
    commentText: "Trial settings validated",
    riskText: null,
    mitigationText: null,
    nextSteps: "Scale to all shifts",
    updatedAt: "2026-01-30T10:00:00Z"
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddd4",
    initiativeId: initiatives[1].id,
    reportingYear: 2026,
    reportingMonth: 2,
    plannedSavingsMonth: 70000,
    achievedSavingsMonth: 70000,
    mainStatus: "IL2",
    riskStatus: "green",
    implementationProgressPct: 45,
    commentText: "Savings on plan",
    riskText: null,
    mitigationText: null,
    nextSteps: "Prepare IL3 documentation",
    updatedAt: "2026-02-26T11:00:00Z"
  }
];

export const logEntries: LogEntry[] = [
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1",
    initiativeId: initiatives[0].id,
    entryType: "action",
    text: "Prepare supplier escalation",
    ownerName: "John Doe",
    dueDate: "2026-04-10",
    status: "open",
    createdAt: "2026-03-27T09:15:00Z"
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2",
    initiativeId: initiatives[1].id,
    entryType: "comment",
    text: "Management informed about capex need",
    ownerName: null,
    dueDate: null,
    status: null,
    createdAt: "2026-03-10T14:00:00Z"
  }
];

export const attachments: Attachment[] = [
  {
    id: "ffffffff-ffff-ffff-ffff-fffffffffff1",
    initiativeId: initiatives[0].id,
    fileName: "business-case.pdf",
    mimeType: "application/pdf",
    fileSizeBytes: 248193,
    storagePath: "initiatives/1001/business-case.pdf",
    createdAt: "2026-03-27T10:14:00Z",
    uploadedBy: { id: users[0].id, name: users[0].name }
  }
];
