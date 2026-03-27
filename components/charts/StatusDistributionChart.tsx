export function StatusDistributionChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((item) => item.count));
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {data.map((item) => (
        <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '56px 1fr 40px', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#374151', fontWeight: 700 }}>{item.label}</div>
          <div style={{ height: 14, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: '#2563eb' }} />
          </div>
          <div style={{ textAlign: 'right', fontSize: 12 }}>{item.count}</div>
        </div>
      ))}
    </div>
  );
}
