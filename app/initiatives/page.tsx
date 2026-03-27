import Link from 'next/link';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { formatCurrency, formatMonth } from '@/lib/format';
import { listAreas, listCategories, listInitiatives } from '@/lib/repositories';

export default async function InitiativesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filters = {
    search: typeof params?.search === 'string' ? params.search : undefined,
    areaId: typeof params?.areaId === 'string' ? params.areaId : undefined,
    categoryId: typeof params?.categoryId === 'string' ? params.categoryId : undefined,
    mainStatus: typeof params?.mainStatus === 'string' ? params.mainStatus : undefined,
    riskStatus: typeof params?.riskStatus === 'string' ? params.riskStatus : undefined,
    poFlagStatus: typeof params?.poFlagStatus === 'string' ? params.poFlagStatus : undefined,
    targetYear: typeof params?.targetYear === 'string' ? params.targetYear : undefined,
    owner: typeof params?.owner === 'string' ? params.owner : undefined,
    isActive: typeof params?.isActive === 'string' ? params.isActive : 'true',
  };
  const [initiatives, areas, categories] = await Promise.all([
    listInitiatives(filters),
    listAreas(),
    listCategories(),
  ]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <PageHeader
        title="Initiatives"
        actions={<div style={{ display: 'flex', gap: 12 }}><a href="/api/exports/initiatives.xlsx" style={{ color: '#111827' }}>Export</a><Link href="/initiatives/new">New Initiative</Link></div>}
      />

      <form method="GET" style={{ display: 'grid', gridTemplateColumns: '2fr repeat(6, minmax(0, 1fr))', gap: 12, background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16 }}>
        <input name="search" defaultValue={filters.search} placeholder="Search title, owner, ID" style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }} />
        <select name="areaId" defaultValue={filters.areaId ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All areas</option>
          {areas.map((item) => <option key={item.id} value={item.id}>{item.nameEn}</option>)}
        </select>
        <select name="categoryId" defaultValue={filters.categoryId ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.nameEn}</option>)}
        </select>
        <input name="owner" defaultValue={filters.owner} placeholder="Owner" style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }} />
        <select name="mainStatus" defaultValue={filters.mainStatus ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All status</option>
          {['IL0','IL1','IL2','IL3','IL4','IL5'].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select name="riskStatus" defaultValue={filters.riskStatus ?? ''} style={{ padding: 10, border: '1px solid #d1d5db', borderRadius: 10 }}>
          <option value="">All risk</option>
          {['green','yellow','red'].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ border: 0, background: '#111827', color: 'white', borderRadius: 10, padding: '10px 14px' }}>Apply</button>
          <Link href="/initiatives" style={{ alignSelf: 'center', color: '#111827' }}>Reset</Link>
        </div>
      </form>

      <DataTable
        headers={['No.', 'Title', 'Area', 'Category', 'Owner', 'Status', 'Risk', 'Planned', 'Achieved', 'Last Update']}
        rows={initiatives.map((item) => [
          <Link key={`${item.id}-link`} href={`/initiatives/${item.id}`}>{item.initiativeNo}</Link>,
          item.title,
          item.area.name,
          item.category.name,
          item.ownerName,
          item.mainStatus ?? '-',
          item.riskStatus ?? '-',
          formatCurrency(item.plannedSavingsTotal),
          formatCurrency(item.achievedSavingsTotal),
          item.lastMonthlyUpdate ? formatMonth(item.lastMonthlyUpdate.reportingYear, item.lastMonthlyUpdate.reportingMonth) : '-',
        ])}
      />
    </div>
  );
}
