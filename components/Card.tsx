import { ReactNode } from 'react';

export function Card({ children, title, actions }: { children: ReactNode; title?: string; actions?: ReactNode }) {
  return (
    <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16 }}>
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
          <div style={{ display: 'flex', gap: 8 }}>{actions}</div>
        </div>
      )}
      {children}
    </section>
  );
}
