export function BarComparisonChart({
  title,
  data,
  leftLabel,
  rightLabel,
}: {
  title?: string;
  data: { label: string; left: number; right: number }[];
  leftLabel: string;
  rightLabel: string;
}) {
  const max = Math.max(1, ...data.flatMap((item) => [item.left, item.right]));
  return (
    <div>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#111827', display: 'inline-block' }} />{leftLabel}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#9ca3af', display: 'inline-block' }} />{rightLabel}</span>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {data.map((item) => (
          <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#374151' }}>{item.label}</div>
            <div style={{ display: 'grid', gap: 4 }}>
              <div style={{ position: 'relative', height: 16, background: '#f3f4f6', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${(item.left / max) * 100}%`, background: '#111827' }} />
              </div>
              <div style={{ position: 'relative', height: 16, background: '#f3f4f6', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${(item.right / max) * 100}%`, background: '#9ca3af' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
