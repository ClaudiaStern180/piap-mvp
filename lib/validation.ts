import { z } from "zod";

export const mainStatusEnum = z.enum(["IL0", "IL1", "IL2", "IL3", "IL4", "IL5"]);
export const riskStatusEnum = z.enum(["green", "yellow", "red"]);
export const poFlagStatusEnum = z.enum(["none", "review_required", "critical", "escalated"]);

export const initiativeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  areaId: z.string().uuid("Area is required"),
  categoryId: z.string().uuid("Category is required"),
  ownerName: z.string().min(1, "Owner is required"),
  targetYear: z.number().int().min(2000).max(2100),
  plannedSavingsTotal: z.number().min(0),
  description: z.string().nullable().optional(),
  sponsorName: z.string().nullable().optional(),
  wslName: z.string().nullable().optional(),
  mainStatus: mainStatusEnum.nullable().optional(),
  riskStatus: riskStatusEnum.nullable().optional(),
  implementationProgressPct: z.number().min(0).max(100).nullable().optional(),
  startDate: z.string().nullable().optional(),
  approvedSavings: z.number().min(0).nullable().optional(),
  investmentAmount: z.number().min(0).nullable().optional(),
  savingType: z.string().nullable().optional(),
  impactOnOi: z.boolean().nullable().optional(),
  riskText: z.string().nullable().optional(),
  mitigationText: z.string().nullable().optional(),
  nextSteps: z.string().nullable().optional(),
  managementComment: z.string().nullable().optional()
});

export const monthlyUpdateSchema = z.object({
  reportingYear: z.number().int().min(2000).max(2100),
  reportingMonth: z.number().int().min(1).max(12),
  plannedSavingsMonth: z.number().min(0).nullable().optional(),
  achievedSavingsMonth: z.number().min(0).nullable().optional(),
  mainStatus: mainStatusEnum.nullable().optional(),
  riskStatus: riskStatusEnum.nullable().optional(),
  implementationProgressPct: z.number().min(0).max(100).nullable().optional(),
  commentText: z.string().nullable().optional(),
  riskText: z.string().nullable().optional(),
  mitigationText: z.string().nullable().optional(),
  nextSteps: z.string().nullable().optional()
});

export const logEntrySchema = z.object({
  entryType: z.enum(["comment", "action", "decision", "risk"]),
  text: z.string().min(1),
  ownerName: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  status: z.enum(["open", "done"]).nullable().optional()
});

export const poFlagSchema = z.object({
  poFlagStatus: poFlagStatusEnum,
  poFlagNote: z.string().nullable().optional()
});
