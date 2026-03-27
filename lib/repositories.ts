import {
  areas as mockAreas,
  attachments as mockAttachments,
  categories as mockCategories,
  initiatives as mockInitiatives,
  logEntries as mockLogEntries,
  monthlyUpdates as mockMonthlyUpdates,
  users as mockUsers,
} from '@/lib/mock-data';
import { isMockMode, query } from '@/lib/db';
import {
  Attachment,
  DashboardSummary,
  InitiativeDetail,
  InitiativeListItem,
  LogEntry,
  MonthlyUpdate,
  PoFlagStatus,
  SelectOption,
  User,
} from '@/lib/types';

type Filters = Record<string, string | null | undefined>;

type InitiativeInput = {
  title: string;
  areaId: string;
  categoryId: string;
  ownerName: string;
  targetYear: number;
  plannedSavingsTotal: number;
  description?: string | null;
  sponsorName?: string | null;
  wslName?: string | null;
  mainStatus?: InitiativeDetail['mainStatus'];
  riskStatus?: InitiativeDetail['riskStatus'];
  implementationProgressPct?: number | null;
  startDate?: string | null;
  approvedSavings?: number | null;
  investmentAmount?: number | null;
  savingType?: string | null;
  impactOnOi?: boolean | null;
  riskText?: string | null;
  mitigationText?: string | null;
  nextSteps?: string | null;
  managementComment?: string | null;
};

function computeAchievedTotal(initiativeId: string) {
  return mockMonthlyUpdates
    .filter((item) => item.initiativeId === initiativeId)
    .reduce((sum, item) => sum + (item.achievedSavingsMonth ?? 0), 0);
}

function latestUpdate(initiativeId: string) {
  const found = mockMonthlyUpdates
    .filter((item) => item.initiativeId === initiativeId)
    .sort((a, b) => `${b.reportingYear}${String(b.reportingMonth).padStart(2, '0')}`.localeCompare(`${a.reportingYear}${String(a.reportingMonth).padStart(2, '0')}`))[0];
  return found ? { reportingYear: found.reportingYear, reportingMonth: found.reportingMonth, updatedAt: found.updatedAt } : null;
}

function rehydrateInitiative(item: InitiativeDetail): InitiativeDetail {
  return {
    ...item,
    achievedSavingsTotal: computeAchievedTotal(item.id),
    lastMonthlyUpdate: latestUpdate(item.id),
    updatedAt: latestUpdate(item.id)?.updatedAt ?? item.updatedAt,
  };
}

function normalizeText(value: string | null | undefined) {
  return value ?? null;
}

function rowToSelectOption(row: any): SelectOption {
  return {
    id: row.id,
    nameDe: row.name_de,
    nameEn: row.name_en,
    code: row.code,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function rowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    preferredLanguage: row.preferred_language,
    isActive: row.is_active,
  };
}

function rowToMonthlyUpdate(row: any): MonthlyUpdate {
  return {
    id: row.id,
    initiativeId: row.initiative_id,
    reportingYear: row.reporting_year,
    reportingMonth: row.reporting_month,
    plannedSavingsMonth: row.planned_savings_month === null ? null : Number(row.planned_savings_month),
    achievedSavingsMonth: row.achieved_savings_month === null ? null : Number(row.achieved_savings_month),
    mainStatus: row.main_status,
    riskStatus: row.risk_status,
    implementationProgressPct: row.implementation_progress_pct === null ? null : Number(row.implementation_progress_pct),
    commentText: row.comment_text,
    riskText: row.risk_text,
    mitigationText: row.mitigation_text,
    nextSteps: row.next_steps,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
}

function rowToLogEntry(row: any): LogEntry {
  return {
    id: row.id,
    initiativeId: row.initiative_id,
    entryType: row.entry_type,
    text: row.text,
    ownerName: row.owner_name,
    dueDate: row.due_date ? new Date(row.due_date).toISOString().slice(0, 10) : null,
    status: row.status,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

function rowToAttachment(row: any): Attachment {
  return {
    id: row.id,
    initiativeId: row.initiative_id,
    fileName: row.file_name,
    mimeType: row.mime_type,
    fileSizeBytes: Number(row.file_size_bytes),
    storagePath: row.storage_path,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    uploadedBy: {
      id: row.uploaded_by,
      name: row.uploaded_by_name ?? 'Unknown',
    },
  };
}

function rowToInitiativeListItem(row: any): InitiativeListItem {
  return {
    id: row.id,
    initiativeNo: row.initiative_no,
    title: row.title,
    area: { id: row.area_id, name: row.area_name },
    category: { id: row.category_id, name: row.category_name },
    ownerName: row.owner_name,
    mainStatus: row.main_status,
    riskStatus: row.risk_status,
    poFlagStatus: row.po_flag_status,
    plannedSavingsTotal: Number(row.planned_savings_total),
    achievedSavingsTotal: Number(row.achieved_savings_total ?? 0),
    currencyCode: 'EUR',
    lastMonthlyUpdate: row.last_reporting_year ? {
      reportingYear: row.last_reporting_year,
      reportingMonth: row.last_reporting_month,
      updatedAt: row.last_monthly_updated_at instanceof Date ? row.last_monthly_updated_at.toISOString() : row.last_monthly_updated_at,
    } : null,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
    isActive: row.is_active,
  };
}

function rowToInitiativeDetail(row: any): InitiativeDetail {
  return {
    ...rowToInitiativeListItem(row),
    description: row.description,
    sponsorName: row.sponsor_name,
    wslName: row.wsl_name,
    implementationProgressPct: row.implementation_progress_pct === null ? null : Number(row.implementation_progress_pct),
    startDate: row.start_date ? new Date(row.start_date).toISOString().slice(0, 10) : null,
    targetYear: row.target_year,
    approvedSavings: row.approved_savings === null ? null : Number(row.approved_savings),
    investmentAmount: row.investment_amount === null ? null : Number(row.investment_amount),
    savingType: row.saving_type,
    impactOnOi: row.impact_on_oi,
    riskText: row.risk_text,
    mitigationText: row.mitigation_text,
    nextSteps: row.next_steps,
    managementComment: row.management_comment,
    poFlagNote: row.po_flag_note,
  };
}

async function listInitiativesPg(filters?: Filters): Promise<InitiativeListItem[]> {
  const params: unknown[] = [];
  const where: string[] = [];
  const add = (sql: string, value: unknown) => {
    params.push(value);
    where.push(sql.replace('?', `$${params.length}`));
  };

  if (filters?.search) {
    add('(i.title ilike ? or i.owner_name ilike ? or cast(i.initiative_no as text) ilike ?)', `%${filters.search}%`);
    params.push(`%${filters.search}%`, `%${filters.search}%`);
    where[where.length - 1] = `(i.title ilike $${params.length - 2} or i.owner_name ilike $${params.length - 1} or cast(i.initiative_no as text) ilike $${params.length})`;
  }
  if (filters?.areaId) add('i.area_id = ?', filters.areaId);
  if (filters?.categoryId) add('i.category_id = ?', filters.categoryId);
  if (filters?.mainStatus) add('i.main_status = ?', filters.mainStatus);
  if (filters?.riskStatus) add('i.risk_status = ?', filters.riskStatus);
  if (filters?.poFlagStatus) add('i.po_flag_status = ?', filters.poFlagStatus);
  if (filters?.targetYear) add('i.target_year = ?', Number(filters.targetYear));
  if (filters?.isActive === 'true') where.push('i.is_active = true');
  if (filters?.isActive === 'false') where.push('i.is_active = false');
  if (filters?.owner) add('i.owner_name ilike ?', `%${filters.owner}%`);

  const sql = `
    with latest as (
      select distinct on (mu.initiative_id)
        mu.initiative_id,
        mu.reporting_year as last_reporting_year,
        mu.reporting_month as last_reporting_month,
        mu.updated_at as last_monthly_updated_at
      from monthly_updates mu
      order by mu.initiative_id, mu.reporting_year desc, mu.reporting_month desc, mu.updated_at desc
    )
    select
      i.id,
      i.initiative_no,
      i.title,
      i.area_id,
      a.name_en as area_name,
      i.category_id,
      c.name_en as category_name,
      i.owner_name,
      i.main_status,
      i.risk_status,
      i.po_flag_status,
      i.planned_savings_total,
      coalesce(sum(mu.achieved_savings_month), 0)::numeric(14,2) as achieved_savings_total,
      latest.last_reporting_year,
      latest.last_reporting_month,
      latest.last_monthly_updated_at,
      i.updated_at,
      i.is_active
    from initiatives i
    join areas a on a.id = i.area_id
    join categories c on c.id = i.category_id
    left join monthly_updates mu on mu.initiative_id = i.id
    left join latest on latest.initiative_id = i.id
    ${where.length ? `where ${where.join(' and ')}` : ''}
    group by i.id, a.name_en, c.name_en, latest.last_reporting_year, latest.last_reporting_month, latest.last_monthly_updated_at
    order by i.initiative_no asc
  `;
  const result = await query(sql, params);
  return result.rows.map(rowToInitiativeListItem);
}

async function getInitiativeDetailPg(id: string): Promise<InitiativeDetail | null> {
  const result = await query(`
    with latest as (
      select distinct on (mu.initiative_id)
        mu.initiative_id,
        mu.reporting_year as last_reporting_year,
        mu.reporting_month as last_reporting_month,
        mu.updated_at as last_monthly_updated_at
      from monthly_updates mu
      where mu.initiative_id = $1
      order by mu.initiative_id, mu.reporting_year desc, mu.reporting_month desc, mu.updated_at desc
    )
    select
      i.*, a.name_en as area_name, c.name_en as category_name,
      coalesce(sum(mu.achieved_savings_month), 0)::numeric(14,2) as achieved_savings_total,
      latest.last_reporting_year,
      latest.last_reporting_month,
      latest.last_monthly_updated_at
    from initiatives i
    join areas a on a.id = i.area_id
    join categories c on c.id = i.category_id
    left join monthly_updates mu on mu.initiative_id = i.id
    left join latest on latest.initiative_id = i.id
    where i.id = $1
    group by i.id, a.name_en, c.name_en, latest.last_reporting_year, latest.last_reporting_month, latest.last_monthly_updated_at
  `, [id]);
  if (!result.rows[0]) return null;
  return rowToInitiativeDetail(result.rows[0]);
}

export async function listAreas(): Promise<SelectOption[]> {
  if (isMockMode()) return mockAreas;
  const result = await query('select * from areas order by sort_order asc, name_en asc');
  return result.rows.map(rowToSelectOption);
}

export async function listCategories(): Promise<SelectOption[]> {
  if (isMockMode()) return mockCategories;
  const result = await query('select * from categories order by sort_order asc, name_en asc');
  return result.rows.map(rowToSelectOption);
}

export async function listUsers(): Promise<User[]> {
  if (isMockMode()) return mockUsers;
  const result = await query('select * from users order by name asc');
  return result.rows.map(rowToUser);
}

export async function listInitiatives(filters?: Filters): Promise<InitiativeListItem[]> {
  if (isMockMode()) {
    let data = mockInitiatives.map(rehydrateInitiative);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((item) => item.title.toLowerCase().includes(q) || item.ownerName.toLowerCase().includes(q) || String(item.initiativeNo).includes(q));
    }
    if (filters?.areaId) data = data.filter((item) => item.area.id === filters.areaId);
    if (filters?.categoryId) data = data.filter((item) => item.category.id === filters.categoryId);
    if (filters?.mainStatus) data = data.filter((item) => item.mainStatus === filters.mainStatus);
    if (filters?.riskStatus) data = data.filter((item) => item.riskStatus === filters.riskStatus);
    if (filters?.poFlagStatus) data = data.filter((item) => item.poFlagStatus === filters.poFlagStatus);
    if (filters?.targetYear) data = data.filter((item) => String(item.targetYear) === filters.targetYear);
    if (filters?.isActive === 'true') data = data.filter((item) => item.isActive);
    if (filters?.isActive === 'false') data = data.filter((item) => !item.isActive);
    if (filters?.owner) data = data.filter((item) => item.ownerName.toLowerCase().includes(filters.owner!.toLowerCase()));
    return data;
  }
  return listInitiativesPg(filters);
}

export async function createInitiative(input: InitiativeInput) {
  if (isMockMode()) {
    const area = mockAreas.find((item) => item.id === input.areaId);
    const category = mockCategories.find((item) => item.id === input.categoryId);
    if (!area || !category) throw new Error('Area or category not found');
    const nextNo = Math.max(...mockInitiatives.map((item) => item.initiativeNo)) + 1;
    const now = new Date().toISOString();
    const initiative: InitiativeDetail = {
      id: crypto.randomUUID(), initiativeNo: nextNo, title: input.title, description: input.description ?? null,
      area: { id: area.id, name: area.nameEn }, category: { id: category.id, name: category.nameEn }, ownerName: input.ownerName,
      sponsorName: input.sponsorName ?? null, wslName: input.wslName ?? null, mainStatus: input.mainStatus ?? null, riskStatus: input.riskStatus ?? null,
      poFlagStatus: 'none', plannedSavingsTotal: input.plannedSavingsTotal, achievedSavingsTotal: 0, currencyCode: 'EUR', lastMonthlyUpdate: null,
      updatedAt: now, isActive: true, implementationProgressPct: input.implementationProgressPct ?? null, startDate: input.startDate ?? null,
      targetYear: input.targetYear, approvedSavings: input.approvedSavings ?? null, investmentAmount: input.investmentAmount ?? null,
      savingType: input.savingType ?? null, impactOnOi: input.impactOnOi ?? null, riskText: input.riskText ?? null, mitigationText: input.mitigationText ?? null,
      nextSteps: input.nextSteps ?? null, managementComment: input.managementComment ?? null, poFlagNote: null,
    };
    mockInitiatives.push(initiative);
    return initiative;
  }

  const result = await query(`
    insert into initiatives (
      title, description, area_id, category_id, owner_name, sponsor_name, wsl_name, main_status, risk_status,
      implementation_progress_pct, start_date, target_year, planned_savings_total, approved_savings,
      investment_amount, saving_type, impact_on_oi, risk_text, mitigation_text, next_steps, management_comment
    ) values (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,
      $10,$11,$12,$13,$14,
      $15,$16,$17,$18,$19,$20,$21
    ) returning id
  `, [
    input.title, normalizeText(input.description), input.areaId, input.categoryId, input.ownerName,
    normalizeText(input.sponsorName), normalizeText(input.wslName), input.mainStatus ?? null, input.riskStatus ?? null,
    input.implementationProgressPct ?? null, input.startDate ?? null, input.targetYear, input.plannedSavingsTotal,
    input.approvedSavings ?? null, input.investmentAmount ?? null, normalizeText(input.savingType),
    input.impactOnOi ?? null, normalizeText(input.riskText), normalizeText(input.mitigationText), normalizeText(input.nextSteps), normalizeText(input.managementComment),
  ]);
  return getInitiativeById(result.rows[0].id);
}

export async function getInitiativeById(id: string) {
  if (isMockMode()) {
    const item = mockInitiatives.find((initiative) => initiative.id === id);
    return item ? rehydrateInitiative(item) : null;
  }
  return getInitiativeDetailPg(id);
}

export async function updateInitiative(id: string, input: Partial<Omit<InitiativeDetail, 'id' | 'initiativeNo' | 'area' | 'category' | 'achievedSavingsTotal' | 'lastMonthlyUpdate'> & { areaId?: string; categoryId?: string }>) {
  if (isMockMode()) {
    const item = mockInitiatives.find((initiative) => initiative.id === id);
    if (!item) return null;
    if (input.areaId) {
      const area = mockAreas.find((candidate) => candidate.id === input.areaId);
      if (area) item.area = { id: area.id, name: area.nameEn };
    }
    if (input.categoryId) {
      const category = mockCategories.find((candidate) => candidate.id === input.categoryId);
      if (category) item.category = { id: category.id, name: category.nameEn };
    }
    Object.assign(item, { ...input, updatedAt: new Date().toISOString() });
    return rehydrateInitiative(item);
  }

  const fields: string[] = [];
  const params: unknown[] = [];
  const set = (column: string, value: unknown) => {
    params.push(value);
    fields.push(`${column} = $${params.length}`);
  };
  if (input.title !== undefined) set('title', input.title);
  if (input.description !== undefined) set('description', input.description);
  if (input.areaId !== undefined) set('area_id', input.areaId);
  if (input.categoryId !== undefined) set('category_id', input.categoryId);
  if (input.ownerName !== undefined) set('owner_name', input.ownerName);
  if (input.sponsorName !== undefined) set('sponsor_name', input.sponsorName);
  if (input.wslName !== undefined) set('wsl_name', input.wslName);
  if (input.mainStatus !== undefined) set('main_status', input.mainStatus);
  if (input.riskStatus !== undefined) set('risk_status', input.riskStatus);
  if (input.implementationProgressPct !== undefined) set('implementation_progress_pct', input.implementationProgressPct);
  if (input.startDate !== undefined) set('start_date', input.startDate);
  if (input.targetYear !== undefined) set('target_year', input.targetYear);
  if (input.plannedSavingsTotal !== undefined) set('planned_savings_total', input.plannedSavingsTotal);
  if (input.approvedSavings !== undefined) set('approved_savings', input.approvedSavings);
  if (input.investmentAmount !== undefined) set('investment_amount', input.investmentAmount);
  if (input.savingType !== undefined) set('saving_type', input.savingType);
  if (input.impactOnOi !== undefined) set('impact_on_oi', input.impactOnOi);
  if (input.riskText !== undefined) set('risk_text', input.riskText);
  if (input.mitigationText !== undefined) set('mitigation_text', input.mitigationText);
  if (input.nextSteps !== undefined) set('next_steps', input.nextSteps);
  if (input.managementComment !== undefined) set('management_comment', input.managementComment);
  if (!fields.length) return getInitiativeById(id);
  params.push(id);
  const result = await query(`update initiatives set ${fields.join(', ')} where id = $${params.length} returning id`, params);
  if (!result.rows[0]) return null;
  return getInitiativeById(id);
}

export async function archiveInitiative(id: string) {
  if (isMockMode()) {
    const item = mockInitiatives.find((initiative) => initiative.id === id);
    if (!item) return null;
    item.isActive = false;
    item.updatedAt = new Date().toISOString();
    return rehydrateInitiative(item);
  }
  const result = await query('update initiatives set is_active = false where id = $1 returning id', [id]);
  if (!result.rows[0]) return null;
  return getInitiativeById(id);
}

export async function listMonthlyUpdates(initiativeId: string) {
  if (isMockMode()) return mockMonthlyUpdates.filter((item) => item.initiativeId === initiativeId).sort((a,b) => (a.reportingYear-b.reportingYear) || (a.reportingMonth-b.reportingMonth));
  const result = await query('select * from monthly_updates where initiative_id = $1 order by reporting_year asc, reporting_month asc', [initiativeId]);
  return result.rows.map(rowToMonthlyUpdate);
}

export async function createMonthlyUpdate(initiativeId: string, input: Omit<MonthlyUpdate, 'id' | 'initiativeId' | 'updatedAt'>) {
  if (isMockMode()) {
    const exists = mockMonthlyUpdates.find((item) => item.initiativeId === initiativeId && item.reportingYear === input.reportingYear && item.reportingMonth === input.reportingMonth);
    if (exists) throw new Error('MONTH_EXISTS');
    const created: MonthlyUpdate = { id: crypto.randomUUID(), initiativeId, ...input, updatedAt: new Date().toISOString() };
    mockMonthlyUpdates.push(created);
    return created;
  }
  const result = await query(`
    insert into monthly_updates (
      initiative_id, reporting_year, reporting_month, planned_savings_month, achieved_savings_month,
      main_status, risk_status, implementation_progress_pct, comment_text, risk_text, mitigation_text, next_steps
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    returning *
  `, [
    initiativeId, input.reportingYear, input.reportingMonth, input.plannedSavingsMonth ?? null, input.achievedSavingsMonth ?? null,
    input.mainStatus ?? null, input.riskStatus ?? null, input.implementationProgressPct ?? null, normalizeText(input.commentText),
    normalizeText(input.riskText), normalizeText(input.mitigationText), normalizeText(input.nextSteps),
  ]);
  return rowToMonthlyUpdate(result.rows[0]);
}

export async function updateMonthlyUpdate(id: string, input: Partial<Omit<MonthlyUpdate, 'id' | 'initiativeId'>>) {
  if (isMockMode()) {
    const item = mockMonthlyUpdates.find((update) => update.id === id);
    if (!item) return null;
    Object.assign(item, input, { updatedAt: new Date().toISOString() });
    return item;
  }
  const fields: string[] = [];
  const params: unknown[] = [];
  const set = (column: string, value: unknown) => { params.push(value); fields.push(`${column} = $${params.length}`); };
  if (input.reportingYear !== undefined) set('reporting_year', input.reportingYear);
  if (input.reportingMonth !== undefined) set('reporting_month', input.reportingMonth);
  if (input.plannedSavingsMonth !== undefined) set('planned_savings_month', input.plannedSavingsMonth);
  if (input.achievedSavingsMonth !== undefined) set('achieved_savings_month', input.achievedSavingsMonth);
  if (input.mainStatus !== undefined) set('main_status', input.mainStatus);
  if (input.riskStatus !== undefined) set('risk_status', input.riskStatus);
  if (input.implementationProgressPct !== undefined) set('implementation_progress_pct', input.implementationProgressPct);
  if (input.commentText !== undefined) set('comment_text', input.commentText);
  if (input.riskText !== undefined) set('risk_text', input.riskText);
  if (input.mitigationText !== undefined) set('mitigation_text', input.mitigationText);
  if (input.nextSteps !== undefined) set('next_steps', input.nextSteps);
  if (!fields.length) return null;
  params.push(id);
  const result = await query(`update monthly_updates set ${fields.join(', ')} where id = $${params.length} returning *`, params);
  return result.rows[0] ? rowToMonthlyUpdate(result.rows[0]) : null;
}

export async function deleteMonthlyUpdate(id: string) {
  if (isMockMode()) {
    const index = mockMonthlyUpdates.findIndex((update) => update.id === id);
    if (index === -1) return false;
    mockMonthlyUpdates.splice(index, 1);
    return true;
  }
  const result = await query('delete from monthly_updates where id = $1', [id]);
  return result.rowCount === 1;
}

export async function listLogEntries(initiativeId: string) {
  if (isMockMode()) return mockLogEntries.filter((item) => item.initiativeId === initiativeId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const result = await query('select * from initiative_log_entries where initiative_id = $1 order by created_at desc', [initiativeId]);
  return result.rows.map(rowToLogEntry);
}

export async function createLogEntry(initiativeId: string, input: Omit<LogEntry, 'id' | 'initiativeId' | 'createdAt'>) {
  if (isMockMode()) {
    const created: LogEntry = { id: crypto.randomUUID(), initiativeId, ...input, createdAt: new Date().toISOString() };
    mockLogEntries.push(created);
    return created;
  }
  const result = await query(
    'insert into initiative_log_entries (initiative_id, entry_type, text, owner_name, due_date, status) values ($1,$2,$3,$4,$5,$6) returning *',
    [initiativeId, input.entryType, input.text, normalizeText(input.ownerName), input.dueDate ?? null, input.status ?? null],
  );
  return rowToLogEntry(result.rows[0]);
}

export async function updateLogEntry(id: string, input: Partial<Omit<LogEntry, 'id' | 'initiativeId' | 'createdAt'>>) {
  if (isMockMode()) {
    const item = mockLogEntries.find((entry) => entry.id === id);
    if (!item) return null;
    Object.assign(item, input);
    return item;
  }
  const fields: string[] = [];
  const params: unknown[] = [];
  const set = (column: string, value: unknown) => { params.push(value); fields.push(`${column} = $${params.length}`); };
  if (input.entryType !== undefined) set('entry_type', input.entryType);
  if (input.text !== undefined) set('text', input.text);
  if (input.ownerName !== undefined) set('owner_name', input.ownerName);
  if (input.dueDate !== undefined) set('due_date', input.dueDate);
  if (input.status !== undefined) set('status', input.status);
  if (!fields.length) return null;
  params.push(id);
  const result = await query(`update initiative_log_entries set ${fields.join(', ')} where id = $${params.length} returning *`, params);
  return result.rows[0] ? rowToLogEntry(result.rows[0]) : null;
}

export async function listAttachments(initiativeId: string) {
  if (isMockMode()) return mockAttachments.filter((item) => item.initiativeId === initiativeId);
  const result = await query(`
    select a.*, u.name as uploaded_by_name
    from attachments a
    left join users u on u.id = a.uploaded_by
    where a.initiative_id = $1
    order by a.created_at desc
  `, [initiativeId]);
  return result.rows.map(rowToAttachment);
}

export async function getAttachmentById(id: string) {
  if (isMockMode()) return mockAttachments.find((item) => item.id === id) ?? null;
  const result = await query(`
    select a.*, u.name as uploaded_by_name
    from attachments a
    left join users u on u.id = a.uploaded_by
    where a.id = $1
  `, [id]);
  return result.rows[0] ? rowToAttachment(result.rows[0]) : null;
}

export async function createAttachment(initiativeId: string, input: Pick<Attachment, 'fileName' | 'mimeType' | 'fileSizeBytes' | 'storagePath'>) {
  if (isMockMode()) {
    const created: Attachment = {
      id: crypto.randomUUID(), initiativeId, fileName: input.fileName, mimeType: input.mimeType, fileSizeBytes: input.fileSizeBytes,
      storagePath: input.storagePath, createdAt: new Date().toISOString(), uploadedBy: { id: mockUsers[0].id, name: mockUsers[0].name },
    };
    mockAttachments.push(created);
    return created;
  }
  const result = await query(`
    insert into attachments (initiative_id, file_name, mime_type, file_size_bytes, storage_path)
    values ($1,$2,$3,$4,$5)
    returning *
  `, [initiativeId, input.fileName, input.mimeType, input.fileSizeBytes, input.storagePath]);
  return rowToAttachment({ ...result.rows[0], uploaded_by_name: 'System' });
}

export async function deleteAttachment(id: string) {
  if (isMockMode()) {
    const index = mockAttachments.findIndex((attachment) => attachment.id === id);
    if (index === -1) return false;
    mockAttachments.splice(index, 1);
    return true;
  }
  const result = await query('delete from attachments where id = $1', [id]);
  return result.rowCount === 1;
}

export async function setPoFlag(id: string, poFlagStatus: PoFlagStatus, poFlagNote: string | null) {
  if (isMockMode()) {
    const item = mockInitiatives.find((initiative) => initiative.id === id);
    if (!item) return null;
    item.poFlagStatus = poFlagStatus;
    item.poFlagNote = poFlagNote;
    item.updatedAt = new Date().toISOString();
    return rehydrateInitiative(item);
  }
  const result = await query('update initiatives set po_flag_status = $1, po_flag_note = $2, po_flagged_at = now() where id = $3 returning id', [poFlagStatus, poFlagNote, id]);
  if (!result.rows[0]) return null;
  return getInitiativeById(id);
}

export async function getDashboardSummary(filters?: Filters): Promise<DashboardSummary> {
  if (isMockMode()) {
    const active = mockInitiatives.filter((item) => item.isActive);
    const plannedSavingsTotal = active.reduce((sum, item) => sum + item.plannedSavingsTotal, 0);
    const achievedSavingsTotal = active.reduce((sum, item) => sum + computeAchievedTotal(item.id), 0);
    return { plannedSavingsTotal, achievedSavingsTotal, gap: plannedSavingsTotal - achievedSavingsTotal, initiativeCount: active.length, currencyCode: 'EUR' };
  }
  const params: unknown[] = [];
  const where: string[] = ['i.is_active = true'];
  if (filters?.targetYear) { params.push(Number(filters.targetYear)); where.push(`i.target_year = $${params.length}`); }
  if (filters?.areaId) { params.push(filters.areaId); where.push(`i.area_id = $${params.length}`); }
  if (filters?.categoryId) { params.push(filters.categoryId); where.push(`i.category_id = $${params.length}`); }
  const result = await query(`
    select
      coalesce(sum(i.planned_savings_total), 0)::numeric(14,2) as planned_savings_total,
      coalesce(sum(mu.achieved_savings_month), 0)::numeric(14,2) as achieved_savings_total,
      count(distinct i.id) as initiative_count
    from initiatives i
    left join monthly_updates mu on mu.initiative_id = i.id
    where ${where.join(' and ')}
  `, params);
  const row = result.rows[0];
  const plannedSavingsTotal = Number(row.planned_savings_total ?? 0);
  const achievedSavingsTotal = Number(row.achieved_savings_total ?? 0);
  return { plannedSavingsTotal, achievedSavingsTotal, gap: plannedSavingsTotal - achievedSavingsTotal, initiativeCount: Number(row.initiative_count ?? 0), currencyCode: 'EUR' };
}

export async function getPlannedVsAchievedByMonth(targetYear?: number) {
  if (isMockMode()) {
    const rows = Array.from({ length: 12 }, (_, idx) => ({ month: idx + 1, plannedSavings: 0, achievedSavings: 0 }));
    mockMonthlyUpdates.forEach((item) => { rows[item.reportingMonth - 1].plannedSavings += item.plannedSavingsMonth ?? 0; rows[item.reportingMonth - 1].achievedSavings += item.achievedSavingsMonth ?? 0; });
    return rows;
  }
  const params: unknown[] = [];
  const where = targetYear ? `where mu.reporting_year = $1` : '';
  if (targetYear) params.push(targetYear);
  const result = await query(`
    select m.month,
      coalesce(sum(mu.planned_savings_month),0)::numeric(14,2) as planned_savings,
      coalesce(sum(mu.achieved_savings_month),0)::numeric(14,2) as achieved_savings
    from generate_series(1,12) as m(month)
    left join monthly_updates mu on mu.reporting_month = m.month ${targetYear ? 'and mu.reporting_year = $1' : ''}
    group by m.month
    order by m.month
  `, params);
  return result.rows.map((row) => ({ month: row.month, plannedSavings: Number(row.planned_savings), achievedSavings: Number(row.achieved_savings) }));
}

export async function getStatusDistribution() {
  if (isMockMode()) {
    const counts = { IL0: 0, IL1: 0, IL2: 0, IL3: 0, IL4: 0, IL5: 0 } as Record<string, number>;
    mockInitiatives.forEach((item) => { if (item.mainStatus) counts[item.mainStatus] += 1; });
    return Object.entries(counts).map(([mainStatus, count]) => ({ mainStatus, count }));
  }
  const result = await query(`
    with statuses as (select unnest(array['IL0','IL1','IL2','IL3','IL4','IL5']) as main_status)
    select s.main_status, coalesce(count(i.id),0)::int as count
    from statuses s
    left join initiatives i on i.main_status::text = s.main_status and i.is_active = true
    group by s.main_status
    order by s.main_status
  `);
  return result.rows.map((row) => ({ mainStatus: row.main_status, count: Number(row.count) }));
}

export async function getSavingsByArea() {
  if (isMockMode()) {
    return mockAreas.map((area) => {
      const areaItems = mockInitiatives.filter((item) => item.area.id === area.id && item.isActive);
      const plannedSavingsTotal = areaItems.reduce((sum, item) => sum + item.plannedSavingsTotal, 0);
      const achievedSavingsTotal = areaItems.reduce((sum, item) => sum + computeAchievedTotal(item.id), 0);
      return { areaId: area.id, areaName: area.nameEn, plannedSavingsTotal, achievedSavingsTotal, gap: plannedSavingsTotal - achievedSavingsTotal };
    }).filter((item) => item.plannedSavingsTotal || item.achievedSavingsTotal);
  }
  const result = await query(`
    select a.id as area_id, a.name_en as area_name,
      coalesce(sum(i.planned_savings_total),0)::numeric(14,2) as planned_savings_total,
      coalesce(sum(mu.achieved_savings_month),0)::numeric(14,2) as achieved_savings_total
    from areas a
    left join initiatives i on i.area_id = a.id and i.is_active = true
    left join monthly_updates mu on mu.initiative_id = i.id
    group by a.id, a.name_en
    having coalesce(sum(i.planned_savings_total),0) <> 0 or coalesce(sum(mu.achieved_savings_month),0) <> 0
    order by a.name_en
  `);
  return result.rows.map((row) => {
    const plannedSavingsTotal = Number(row.planned_savings_total);
    const achievedSavingsTotal = Number(row.achieved_savings_total);
    return { areaId: row.area_id, areaName: row.area_name, plannedSavingsTotal, achievedSavingsTotal, gap: plannedSavingsTotal - achievedSavingsTotal };
  });
}

export async function getTopInitiatives(limit = 10) {
  if (isMockMode()) {
    return mockInitiatives.map((item) => {
      const achievedSavingsTotal = computeAchievedTotal(item.id);
      return { id: item.id, initiativeNo: item.initiativeNo, title: item.title, areaName: item.area.name, plannedSavingsTotal: item.plannedSavingsTotal, achievedSavingsTotal, gap: item.plannedSavingsTotal - achievedSavingsTotal };
    }).sort((a, b) => b.plannedSavingsTotal - a.plannedSavingsTotal).slice(0, limit);
  }
  const result = await query(`
    select i.id, i.initiative_no, i.title, a.name_en as area_name,
      i.planned_savings_total,
      coalesce(sum(mu.achieved_savings_month),0)::numeric(14,2) as achieved_savings_total
    from initiatives i
    join areas a on a.id = i.area_id
    left join monthly_updates mu on mu.initiative_id = i.id
    where i.is_active = true
    group by i.id, a.name_en
    order by i.planned_savings_total desc
    limit $1
  `, [limit]);
  return result.rows.map((row) => {
    const achievedSavingsTotal = Number(row.achieved_savings_total);
    const plannedSavingsTotal = Number(row.planned_savings_total);
    return { id: row.id, initiativeNo: row.initiative_no, title: row.title, areaName: row.area_name, plannedSavingsTotal, achievedSavingsTotal, gap: plannedSavingsTotal - achievedSavingsTotal };
  });
}

export async function getRiskList() {
  if (isMockMode()) {
    return mockInitiatives.filter((item) => item.riskStatus === 'yellow' || item.riskStatus === 'red' || item.poFlagStatus !== 'none').map((item) => ({ id: item.id, initiativeNo: item.initiativeNo, title: item.title, areaName: item.area.name, ownerName: item.ownerName, mainStatus: item.mainStatus, riskStatus: item.riskStatus, poFlagStatus: item.poFlagStatus, riskText: item.riskText, mitigationText: item.mitigationText, lastMonthlyUpdate: latestUpdate(item.id) }));
  }
  const result = await query(`
    with latest as (
      select distinct on (mu.initiative_id)
        mu.initiative_id, mu.reporting_year, mu.reporting_month, mu.updated_at
      from monthly_updates mu
      order by mu.initiative_id, mu.reporting_year desc, mu.reporting_month desc, mu.updated_at desc
    )
    select i.id, i.initiative_no, i.title, a.name_en as area_name, i.owner_name, i.main_status, i.risk_status,
      i.po_flag_status, i.risk_text, i.mitigation_text,
      latest.reporting_year as last_reporting_year,
      latest.reporting_month as last_reporting_month,
      latest.updated_at as last_monthly_updated_at
    from initiatives i
    join areas a on a.id = i.area_id
    left join latest on latest.initiative_id = i.id
    where i.is_active = true and (i.risk_status in ('yellow','red') or i.po_flag_status <> 'none')
    order by i.initiative_no asc
  `);
  return result.rows.map((row) => ({
    id: row.id,
    initiativeNo: row.initiative_no,
    title: row.title,
    areaName: row.area_name,
    ownerName: row.owner_name,
    mainStatus: row.main_status,
    riskStatus: row.risk_status,
    poFlagStatus: row.po_flag_status,
    riskText: row.risk_text,
    mitigationText: row.mitigation_text,
    lastMonthlyUpdate: row.last_reporting_year ? {
      reportingYear: row.last_reporting_year,
      reportingMonth: row.last_reporting_month,
      updatedAt: row.last_monthly_updated_at instanceof Date ? row.last_monthly_updated_at.toISOString() : row.last_monthly_updated_at,
    } : null,
  }));
}

export async function getPoReview() {
  const items = await getRiskList();
  if (isMockMode()) {
    return items.map((item) => {
      const source = mockInitiatives.find((i) => i.id === item.id);
      const plannedSavingsTotal = source?.plannedSavingsTotal ?? 0;
      const achievedSavingsTotal = computeAchievedTotal(item.id);
      return { ...item, plannedSavingsTotal, achievedSavingsTotal, gap: plannedSavingsTotal - achievedSavingsTotal };
    });
  }

  const all = await listInitiatives({ isActive: 'true' });
  const byId = new Map(all.map((item) => [item.id, item]));
  return items.map((item) => {
    const source = byId.get(item.id);
    const plannedSavingsTotal = source?.plannedSavingsTotal ?? 0;
    const achievedSavingsTotal = source?.achievedSavingsTotal ?? 0;
    return { ...item, plannedSavingsTotal, achievedSavingsTotal, gap: plannedSavingsTotal - achievedSavingsTotal };
  });
}
