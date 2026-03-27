'use client';

import { useState } from 'react';

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db', background: '#fff' };
const textAreaStyle: React.CSSProperties = { ...inputStyle, minHeight: 90 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, fontWeight: 600, fontSize: 14 };

export function MonthlyUpdateForm({ initiativeId }: { initiativeId: string }) {
  const [form, setForm] = useState({
    reportingYear: new Date().getFullYear().toString(),
    reportingMonth: String(new Date().getMonth() + 1),
    plannedSavingsMonth: '',
    achievedSavingsMonth: '',
    mainStatus: '',
    riskStatus: '',
    implementationProgressPct: '',
    commentText: '',
    riskText: '',
    mitigationText: '',
    nextSteps: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const response = await fetch(`/api/initiatives/${initiativeId}/monthly-updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportingYear: Number(form.reportingYear),
        reportingMonth: Number(form.reportingMonth),
        plannedSavingsMonth: form.plannedSavingsMonth ? Number(form.plannedSavingsMonth) : null,
        achievedSavingsMonth: form.achievedSavingsMonth ? Number(form.achievedSavingsMonth) : null,
        mainStatus: form.mainStatus || null,
        riskStatus: form.riskStatus || null,
        implementationProgressPct: form.implementationProgressPct ? Number(form.implementationProgressPct) : null,
        commentText: form.commentText || null,
        riskText: form.riskText || null,
        mitigationText: form.mitigationText || null,
        nextSteps: form.nextSteps || null,
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json?.error?.message ?? 'Creating monthly update failed');
      setSaving(false);
      return;
    }
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      {error && <div style={{ padding: 12, borderRadius: 10, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <label style={labelStyle}>Year *<input type="number" value={form.reportingYear} onChange={(e) => update('reportingYear', e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>Month *<select value={form.reportingMonth} onChange={(e) => update('reportingMonth', e.target.value)} style={inputStyle}>{Array.from({ length: 12 }, (_, index) => index + 1).map((month) => <option key={month} value={month}>{month}</option>)}</select></label>
        <label style={labelStyle}>Progress %<input type="number" min={0} max={100} value={form.implementationProgressPct} onChange={(e) => update('implementationProgressPct', e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>Planned Savings<input type="number" min={0} step="0.01" value={form.plannedSavingsMonth} onChange={(e) => update('plannedSavingsMonth', e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>Achieved Savings<input type="number" min={0} step="0.01" value={form.achievedSavingsMonth} onChange={(e) => update('achievedSavingsMonth', e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>Main Status<select value={form.mainStatus} onChange={(e) => update('mainStatus', e.target.value)} style={inputStyle}><option value="">-</option>{['IL0','IL1','IL2','IL3','IL4','IL5'].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label style={labelStyle}>Risk Status<select value={form.riskStatus} onChange={(e) => update('riskStatus', e.target.value)} style={inputStyle}><option value="">-</option>{['green','yellow','red'].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>
      <label style={labelStyle}>Comment<textarea value={form.commentText} onChange={(e) => update('commentText', e.target.value)} style={textAreaStyle} /></label>
      <label style={labelStyle}>Risk<textarea value={form.riskText} onChange={(e) => update('riskText', e.target.value)} style={textAreaStyle} /></label>
      <label style={labelStyle}>Mitigation<textarea value={form.mitigationText} onChange={(e) => update('mitigationText', e.target.value)} style={textAreaStyle} /></label>
      <label style={labelStyle}>Next Steps<textarea value={form.nextSteps} onChange={(e) => update('nextSteps', e.target.value)} style={textAreaStyle} /></label>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" disabled={saving} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #111827', color: '#fff', background: '#111827', fontWeight: 700 }}>{saving ? 'Saving...' : 'Create Monthly Update'}</button>
      </div>
    </form>
  );
}
