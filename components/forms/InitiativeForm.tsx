'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SelectOption, InitiativeDetail } from '@/lib/types';

type Props = {
  mode: 'create' | 'edit';
  areas: SelectOption[];
  categories: SelectOption[];
  initialValue?: Partial<InitiativeDetail> & { areaId?: string; categoryId?: string };
};

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db', background: '#fff' };
const textAreaStyle: React.CSSProperties = { ...inputStyle, minHeight: 110 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, fontWeight: 600, fontSize: 14 };
const sectionStyle: React.CSSProperties = { display: 'grid', gap: 16, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16 };

export function InitiativeForm({ mode, areas, categories, initialValue }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialValue?.title ?? '',
    description: initialValue?.description ?? '',
    areaId: initialValue?.areaId ?? initialValue?.area?.id ?? areas[0]?.id ?? '',
    categoryId: initialValue?.categoryId ?? initialValue?.category?.id ?? categories[0]?.id ?? '',
    ownerName: initialValue?.ownerName ?? '',
    sponsorName: initialValue?.sponsorName ?? '',
    wslName: initialValue?.wslName ?? '',
    mainStatus: initialValue?.mainStatus ?? '',
    riskStatus: initialValue?.riskStatus ?? '',
    implementationProgressPct: initialValue?.implementationProgressPct?.toString() ?? '',
    startDate: initialValue?.startDate ?? '',
    targetYear: initialValue?.targetYear?.toString() ?? String(new Date().getFullYear()),
    plannedSavingsTotal: initialValue?.plannedSavingsTotal?.toString() ?? '',
    approvedSavings: initialValue?.approvedSavings?.toString() ?? '',
    investmentAmount: initialValue?.investmentAmount?.toString() ?? '',
    savingType: initialValue?.savingType ?? '',
    impactOnOi: initialValue?.impactOnOi ?? false,
    riskText: initialValue?.riskText ?? '',
    mitigationText: initialValue?.mitigationText ?? '',
    nextSteps: initialValue?.nextSteps ?? '',
    managementComment: initialValue?.managementComment ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const endpoint = useMemo(() => mode === 'create' ? '/api/initiatives' : `/api/initiatives/${initialValue?.id}`, [mode, initialValue?.id]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      mainStatus: form.mainStatus || null,
      riskStatus: form.riskStatus || null,
      description: form.description || null,
      sponsorName: form.sponsorName || null,
      wslName: form.wslName || null,
      implementationProgressPct: form.implementationProgressPct ? Number(form.implementationProgressPct) : null,
      startDate: form.startDate || null,
      targetYear: Number(form.targetYear),
      plannedSavingsTotal: Number(form.plannedSavingsTotal),
      approvedSavings: form.approvedSavings ? Number(form.approvedSavings) : null,
      investmentAmount: form.investmentAmount ? Number(form.investmentAmount) : null,
      savingType: form.savingType || null,
      impactOnOi: form.impactOnOi,
      riskText: form.riskText || null,
      mitigationText: form.mitigationText || null,
      nextSteps: form.nextSteps || null,
      managementComment: form.managementComment || null,
    };

    const response = await fetch(endpoint, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? 'Saving failed');
      setSaving(false);
      return;
    }
    const nextId = json.data.id ?? initialValue?.id ?? '';
    router.push(`/initiatives/${nextId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
      {error && <div style={{ padding: 12, borderRadius: 10, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>{error}</div>}
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>General</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
          <label style={labelStyle}>Title *<input required value={form.title} onChange={(e) => update('title', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Target Year *<input required type="number" value={form.targetYear} onChange={(e) => update('targetYear', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Start Date<input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} style={inputStyle} /></label>
        </div>
        <label style={labelStyle}>Description<textarea value={form.description} onChange={(e) => update('description', e.target.value)} style={textAreaStyle} /></label>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Classification</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={labelStyle}>Area *<select required value={form.areaId} onChange={(e) => update('areaId', e.target.value)} style={inputStyle}>{areas.map((item) => <option key={item.id} value={item.id}>{item.nameEn}</option>)}</select></label>
          <label style={labelStyle}>Category *<select required value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} style={inputStyle}>{categories.map((item) => <option key={item.id} value={item.id}>{item.nameEn}</option>)}</select></label>
          <label style={labelStyle}>Owner *<input required value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Sponsor<input value={form.sponsorName} onChange={(e) => update('sponsorName', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>WSL<input value={form.wslName} onChange={(e) => update('wslName', e.target.value)} style={inputStyle} /></label>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Status & Financials</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <label style={labelStyle}>Main Status<select value={form.mainStatus} onChange={(e) => update('mainStatus', e.target.value as any)} style={inputStyle}><option value="">-</option>{['IL0','IL1','IL2','IL3','IL4','IL5'].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label style={labelStyle}>Risk Status<select value={form.riskStatus} onChange={(e) => update('riskStatus', e.target.value as any)} style={inputStyle}><option value="">-</option>{['green','yellow','red'].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label style={labelStyle}>Progress %<input type="number" min={0} max={100} value={form.implementationProgressPct} onChange={(e) => update('implementationProgressPct', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Planned Savings *<input required type="number" min={0} step="0.01" value={form.plannedSavingsTotal} onChange={(e) => update('plannedSavingsTotal', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Approved Savings<input type="number" min={0} step="0.01" value={form.approvedSavings} onChange={(e) => update('approvedSavings', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Investment Amount<input type="number" min={0} step="0.01" value={form.investmentAmount} onChange={(e) => update('investmentAmount', e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Saving Type<input value={form.savingType} onChange={(e) => update('savingType', e.target.value)} style={inputStyle} /></label>
          <label style={{ ...labelStyle, alignContent: 'end' }}><span>Impact on OI</span><input type="checkbox" checked={form.impactOnOi} onChange={(e) => update('impactOnOi', e.target.checked)} /></label>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Risk & Notes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={labelStyle}>Risk Text<textarea value={form.riskText} onChange={(e) => update('riskText', e.target.value)} style={textAreaStyle} /></label>
          <label style={labelStyle}>Mitigation Text<textarea value={form.mitigationText} onChange={(e) => update('mitigationText', e.target.value)} style={textAreaStyle} /></label>
          <label style={labelStyle}>Next Steps<textarea value={form.nextSteps} onChange={(e) => update('nextSteps', e.target.value)} style={textAreaStyle} /></label>
          <label style={labelStyle}>Management Comment<textarea value={form.managementComment} onChange={(e) => update('managementComment', e.target.value)} style={textAreaStyle} /></label>
        </div>
      </section>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <a href={initialValue?.id ? `/initiatives/${initialValue.id}` : '/initiatives'} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #d1d5db', color: '#111827', textDecoration: 'none', background: '#fff' }}>Cancel</a>
        <button type="submit" disabled={saving} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #111827', color: '#fff', background: '#111827', fontWeight: 700 }}>{saving ? 'Saving...' : mode === 'create' ? 'Create Initiative' : 'Save Changes'}</button>
      </div>
    </form>
  );
}
