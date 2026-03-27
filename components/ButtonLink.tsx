import Link from 'next/link';
import { ReactNode } from 'react';

export function ButtonLink({ href, children, variant = 'primary' }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary' }) {
  const primary = variant === 'primary';
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', borderRadius: 10, background: primary ? '#111827' : '#fff', color: primary ? '#fff' : '#111827', border: primary ? '1px solid #111827' : '1px solid #d1d5db', fontWeight: 600 }}>
      {children}
    </Link>
  );
}
