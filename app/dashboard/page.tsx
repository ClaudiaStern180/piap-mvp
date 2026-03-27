import Link from 'next/link';
import { BarComparisonChart } from '@/components/charts/BarComparisonChart';
import { StatusDistributionChart } from '@/components/charts/StatusDistributionChart';
import { Card } from '@/components/Card';
import { KpiCard } from '@/components/KpiCard';
import { PageHeader } from '@/components/PageHeader';
import { formatCurrency } from '@/lib/format';
import {
  getDashboardSummary,
  getPlannedVsAchievedByMonth,
  getRiskList,
  getSavingsByArea,
  getStatusDistribution,
  getTopInitiatives,
  listAreas,
  listCategories,
} from '@/lib/repositories';

export default async function DashboardPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filters = {
    targetYear: typeof params?.targetYear === 'string' ? params.targetYear : undefined,
    areaId: typeof params?.areaId === 'string' ? params.areaId : undefined,
    categoryId: typeof params?.categoryId === 'string' ? params.categoryId : undefined,
  };
  const year = filters.targetYear ? Number(filters.targetYear) : undefined;

  const [summary, monthSeries, top, riskList, statusDistribution, savingsByArea, areas, categories] = await Promise.all([
    getDashboardSummary(filters),
    getPlannedVsAchievedByMonth(year),
    getTopInitiatives(),
    getRiskList(),
    getStatusDistribution(),
    getSavingsByArea(),
    listAreas(),
    listCategories(),
  ]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <PageHeader title="Dashboard" />
      <form method="GET" style={{ display: 'flex', gap: 12, background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, flexWrap: 'wrap' }}>
        <input name="targetYear" defaultValue={filters.targetYear} placeholder="Target year" style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }} />
        <select name="areaId" defaultValue={filters.areaId ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All areas</option>
          {areas.map((item) => <option key={item.id} value={item.id}>{item.nameEn}</option>)}
        </select>
        <select name="categoryId" defaultValue={filters.categoryId ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.nameEn}</option>)}
        </select>
        <button type="submit" style={{ border: 0, background: '#111827', color: 'white', borderRadius: 10, padding: '10px 14px' }}>Apply</button>
        <Link href="/dashboard" style={{ alignSelf: 'center', color: '#111827' }}>Reset</Link>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
        <KpiCard label="Planned Savings" value={formatCurrency(summary.plannedSavingsTotal)} />
        <KpiCard label="Achieved Savings" value={formatCurrency(summary.achievedSavingsTotal)} />
        <KpiCard label="Gap" value={formatCurrency(summary.gap)} />
        <KpiCard label="Initiatives" value={String(summary.initiativeCount)} />
      </div>

      <Card title="Planned vs Achieved by Month">
        <BarComparisonChart
          data={monthSeries.map((item) => ({ label: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][item.month - 1], left: item.plannedSavings, right: item.achievedSavings }))}
          leftLabel="Planned"
          rightLabel="Achieved"
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Status Distribution">
          <StatusDistributionChart data={statusDistribution.map((item) => ({ label: item.mainStatus, count: item.count }))} />
        </Card>
        <Card title="Savings by Area">
          <BarComparisonChart
            data={savingsByArea.map((item) => ({ label: item.areaName, left: item.plannedSavingsTotal, right: item.achievedSavingsTotal }))}
            leftLabel="Planned"
            rightLabel="Achieved"
          />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Top Initiatives">
          <div style={{ display: 'grid', gap: 10 }}>
            {top.map((item) => (
              <Link key={item.id} href={`/initiatives/${item.id}`} style={{ textDecoration: 'none', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, display: 'grid', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <strong>{item.initiativeNo} · {item.title}</strong>
                  <span>{item.areaName}</span>
                </div>
                <div style={{ fontSize: 13, color: '#4b5563' }}>
                  Planned {formatCurrency(item.plannedSavingsTotal)} · Achieved {formatCurrency(item.achievedSavingsTotal)} · Gap {formatCurrency(item.gap)}
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <Card title="Risk List">
          <div style={{ display: 'grid', gap: 10 }}>
            {riskList.map((item) => (
              <Link key={item.id} href={`/initiatives/${item.id}`} style={{ textDecoration: 'none', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, display: 'grid', gap: 4 }}>
                <strong>{item.initiativeNo} · {item.title}</strong>
                <div style={{ fontSize: 13, color: '#4b5563' }}>{item.ownerName} · Risk {item.riskStatus ?? '-'} · PO {item.poFlagStatus}</div>
                <div style={{ fontSize: 13 }}>{item.riskText ?? 'No detailed risk text available.'}</div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
