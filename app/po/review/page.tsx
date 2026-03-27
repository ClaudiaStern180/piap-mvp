import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { formatCurrency, formatMonth } from '@/lib/format';
import { getRiskList, listAreas } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';

export default async function PoReviewPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  try {
    await requireRole(['po', 'admin']);
  } catch {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const areaId = typeof params?.areaId === 'string' ? params.areaId : undefined;
  const riskStatus = typeof params?.riskStatus === 'string' ? params.riskStatus : undefined;
  const poFlagStatus = typeof params?.poFlagStatus === 'string' ? params.poFlagStatus : undefined;

  const [items, areas] = await Promise.all([getRiskList(), listAreas()]);
  const filtered = items.filter((item) => {
    if (areaId) {
      const area = areas.find((a) => a.id === areaId);
      if (!area || area.nameEn !== item.areaName) return false;
    }
    if (riskStatus && item.riskStatus !== riskStatus) return false;
    if (poFlagStatus && item.poFlagStatus !== poFlagStatus) return false;
    return true;
  });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <PageHeader title="PO Review" />
      <form method="GET" style={{ display: 'flex', gap: 12, background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, flexWrap: 'wrap' }}>
        <select name="areaId" defaultValue={areaId ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All areas</option>
          {areas.map((item) => <option key={item.id} value={item.id}>{item.nameEn}</option>)}
        </select>
        <select name="riskStatus" defaultValue={riskStatus ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All risks</option>
          {['yellow','red'].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select name="poFlagStatus" defaultValue={poFlagStatus ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All PO flags</option>
          {['review_required','critical','escalated'].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <button type="submit" style={{ border: 0, background: '#111827', color: 'white', borderRadius: 10, padding: '10px 14px' }}>Apply</button>
        <a href="/po/review" style={{ alignSelf: 'center', color: '#111827' }}>Reset</a>
      </form>
      <DataTable
        headers={['No.', 'Title', 'Area', 'Owner', 'Risk', 'PO Flag', 'Last Update', 'Gap (placeholder)']}
        rows={filtered.map((item) => [
          item.initiativeNo,
          item.title,
          item.areaName,
          item.ownerName,
          item.riskStatus ?? '-',
          item.poFlagStatus,
          item.lastMonthlyUpdate ? formatMonth(item.lastMonthlyUpdate.reportingYear, item.lastMonthlyUpdate.reportingMonth) : '-',
          formatCurrency(0),
        ])}
      />
    </div>
  );
}
