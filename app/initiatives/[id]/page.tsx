import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/Badge';
import { ButtonLink } from '@/components/ButtonLink';
import { Card } from '@/components/Card';
import { DataTable } from '@/components/DataTable';
import { MonthlyUpdateForm } from '@/components/forms/MonthlyUpdateForm';
import { KpiCard } from '@/components/KpiCard';
import { PageHeader } from '@/components/PageHeader';
import { formatCurrency, formatMonth } from '@/lib/format';
import { getInitiativeById, listAttachments, listLogEntries, listMonthlyUpdates } from '@/lib/repositories';

function riskTone(value: string | null) {
  if (value === 'green') return 'green';
  if (value === 'yellow') return 'yellow';
  if (value === 'red') return 'red';
  return 'neutral';
}

function poTone(value: string) {
  if (value === 'critical' || value === 'escalated') return 'red';
  if (value === 'review_required') return 'orange';
  return 'blue';
}

export default async function InitiativeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [initiative, monthlyUpdates, logEntries, attachments] = await Promise.all([
    getInitiativeById(id),
    listMonthlyUpdates(id),
    listLogEntries(id),
    listAttachments(id),
  ]);

  if (!initiative) notFound();

  const gap = initiative.plannedSavingsTotal - initiative.achievedSavingsTotal;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <PageHeader
        title={`Initiative ${initiative.initiativeNo}`}
        actions={
          <>
            <ButtonLink href={`/api/exports/initiatives/${initiative.id}.xlsx`} variant="secondary">Export</ButtonLink>
            <ButtonLink href={`/initiatives/${initiative.id}/edit`}>Edit</ButtonLink>
          </>
        }
      />

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{initiative.title}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge label={initiative.mainStatus ?? 'No status'} tone="blue" />
              <Badge label={initiative.riskStatus ?? 'No risk'} tone={riskTone(initiative.riskStatus)} />
              <Badge label={initiative.poFlagStatus} tone={poTone(initiative.poFlagStatus)} />
              {!initiative.isActive && <Badge label="Archived" tone="red" />}
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', textAlign: 'right' }}>
            <div>Area: {initiative.area.name}</div>
            <div>Category: {initiative.category.name}</div>
            <div>Owner: {initiative.ownerName}</div>
            <div>Target year: {initiative.targetYear}</div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
        <KpiCard label="Planned Savings" value={formatCurrency(initiative.plannedSavingsTotal)} />
        <KpiCard label="Achieved Savings" value={formatCurrency(initiative.achievedSavingsTotal)} />
        <KpiCard label="Gap" value={formatCurrency(gap)} />
        <KpiCard label="Progress" value={initiative.implementationProgressPct != null ? `${initiative.implementationProgressPct}%` : '-'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 16 }}>
        <Card title="Overview">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, fontSize: 14 }}>
            <div><strong>Sponsor</strong><div>{initiative.sponsorName ?? '-'}</div></div>
            <div><strong>WSL</strong><div>{initiative.wslName ?? '-'}</div></div>
            <div><strong>Start Date</strong><div>{initiative.startDate ?? '-'}</div></div>
            <div><strong>Saving Type</strong><div>{initiative.savingType ?? '-'}</div></div>
            <div><strong>Approved Savings</strong><div>{initiative.approvedSavings != null ? formatCurrency(initiative.approvedSavings) : '-'}</div></div>
            <div><strong>Investment</strong><div>{initiative.investmentAmount != null ? formatCurrency(initiative.investmentAmount) : '-'}</div></div>
            <div><strong>Impact on OI</strong><div>{initiative.impactOnOi == null ? '-' : initiative.impactOnOi ? 'Yes' : 'No'}</div></div>
            <div><strong>Last Update</strong><div>{initiative.lastMonthlyUpdate ? formatMonth(initiative.lastMonthlyUpdate.reportingYear, initiative.lastMonthlyUpdate.reportingMonth) : '-'}</div></div>
          </div>
          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            <div><strong>Description</strong><div>{initiative.description ?? '-'}</div></div>
            <div><strong>Risk</strong><div>{initiative.riskText ?? '-'}</div></div>
            <div><strong>Mitigation</strong><div>{initiative.mitigationText ?? '-'}</div></div>
            <div><strong>Next Steps</strong><div>{initiative.nextSteps ?? '-'}</div></div>
            <div><strong>Management Comment</strong><div>{initiative.managementComment ?? '-'}</div></div>
            <div><strong>PO Flag Note</strong><div>{initiative.poFlagNote ?? '-'}</div></div>
          </div>
        </Card>

        <Card title="Add Monthly Update">
          <MonthlyUpdateForm initiativeId={initiative.id} />
        </Card>
      </div>

      <Card title="Monthly Updates">
        <DataTable
          headers={['Year', 'Month', 'Planned', 'Achieved', 'Gap', 'Status', 'Risk', 'Progress', 'Updated']}
          rows={monthlyUpdates.map((item) => [
            item.reportingYear,
            item.reportingMonth,
            item.plannedSavingsMonth != null ? formatCurrency(item.plannedSavingsMonth) : '-',
            item.achievedSavingsMonth != null ? formatCurrency(item.achievedSavingsMonth) : '-',
            formatCurrency((item.plannedSavingsMonth ?? 0) - (item.achievedSavingsMonth ?? 0)),
            item.mainStatus ?? '-',
            item.riskStatus ?? '-',
            item.implementationProgressPct != null ? `${item.implementationProgressPct}%` : '-',
            item.updatedAt.slice(0, 10),
          ])}
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Comments & Actions">
          <DataTable
            headers={['Type', 'Text', 'Owner', 'Due Date', 'Status', 'Created']}
            rows={logEntries.map((item) => [item.entryType, item.text, item.ownerName ?? '-', item.dueDate ?? '-', item.status ?? '-', item.createdAt.slice(0, 10)])}
          />
        </Card>
        <Card title="Attachments" actions={<ButtonLink href={`/api/exports/initiatives/${initiative.id}.xlsx`} variant="secondary">Open export</ButtonLink>}>
          {attachments.length ? (
            <DataTable
              headers={['File', 'Type', 'Size', 'Uploaded By', 'Actions']}
              rows={attachments.map((item) => [
                item.fileName,
                item.mimeType ?? '-',
                `${Math.max(1, Math.round(item.fileSizeBytes / 1024))} KB`,
                item.uploadedBy.name,
                <Link key={item.id} href={`/api/attachments/${item.id}`}>Download</Link>,
              ])}
            />
          ) : (
            <div style={{ color: '#6b7280' }}>No attachments yet.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
