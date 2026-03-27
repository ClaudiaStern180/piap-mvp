export function Badge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'green' | 'yellow' | 'red' | 'blue' | 'orange' }) {
  const palette = {
    neutral: { bg: '#eef2f7', color: '#334155' },
    green: { bg: '#dcfce7', color: '#166534' },
    yellow: { bg: '#fef3c7', color: '#92400e' },
    red: { bg: '#fee2e2', color: '#991b1b' },
    blue: { bg: '#dbeafe', color: '#1d4ed8' },
    orange: { bg: '#ffedd5', color: '#c2410c' },
  } as const;
  const style = palette[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 999, background: style.bg, color: style.color, fontSize: 12, fontWeight: 700 }}>{label}</span>;
}
