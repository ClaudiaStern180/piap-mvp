export type UserRole = "clerk" | "po" | "admin";
export type MainStatus = "IL0" | "IL1" | "IL2" | "IL3" | "IL4" | "IL5";
export type RiskStatus = "green" | "yellow" | "red";
export type PoFlagStatus = "none" | "review_required" | "critical" | "escalated";
export type AppLanguage = "en" | "de";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage: AppLanguage;
  isActive: boolean;
}

export interface SelectOption {
  id: string;
  nameDe?: string | null;
  nameEn: string;
  code: string;
  sortOrder: number;
  isActive: boolean;
}

export interface InitiativeListItem {
  id: string;
  initiativeNo: number;
  title: string;
  area: { id: string; name: string };
  category: { id: string; name: string };
  ownerName: string;
  mainStatus: MainStatus | null;
  riskStatus: RiskStatus | null;
  poFlagStatus: PoFlagStatus;
  plannedSavingsTotal: number;
  achievedSavingsTotal: number;
  currencyCode: "EUR";
  lastMonthlyUpdate: {
    reportingYear: number;
    reportingMonth: number;
    updatedAt: string;
  } | null;
  updatedAt: string;
  isActive: boolean;
}

export interface InitiativeDetail extends InitiativeListItem {
  description: string | null;
  sponsorName: string | null;
  wslName: string | null;
  implementationProgressPct: number | null;
  startDate: string | null;
  targetYear: number;
  approvedSavings: number | null;
  investmentAmount: number | null;
  savingType: string | null;
  impactOnOi: boolean | null;
  riskText: string | null;
  mitigationText: string | null;
  nextSteps: string | null;
  managementComment: string | null;
  poFlagNote: string | null;
}

export interface MonthlyUpdate {
  id: string;
  initiativeId: string;
  reportingYear: number;
  reportingMonth: number;
  plannedSavingsMonth: number | null;
  achievedSavingsMonth: number | null;
  mainStatus: MainStatus | null;
  riskStatus: RiskStatus | null;
  implementationProgressPct: number | null;
  commentText: string | null;
  riskText: string | null;
  mitigationText: string | null;
  nextSteps: string | null;
  updatedAt: string;
}

export interface LogEntry {
  id: string;
  initiativeId: string;
  entryType: "comment" | "action" | "decision" | "risk";
  text: string;
  ownerName: string | null;
  dueDate: string | null;
  status: "open" | "done" | null;
  createdAt: string;
}

export interface Attachment {
  id: string;
  initiativeId: string;
  fileName: string;
  mimeType: string | null;
  fileSizeBytes: number;
  storagePath: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string;
  };
}

export interface DashboardSummary {
  plannedSavingsTotal: number;
  achievedSavingsTotal: number;
  gap: number;
  initiativeCount: number;
  currencyCode: "EUR";
}
