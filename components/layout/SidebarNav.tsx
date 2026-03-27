import Link from 'next/link';
import { User } from '@/lib/types';

export function SidebarNav({ user }: { user: User | null }) {
  const items = [
    { href: '/dashboard', label: 'Dashboard', roles: ['clerk', 'po', 'admin'] },
    { href: '/initiatives', label: 'Initiatives', roles: ['clerk', 'po', 'admin'] },
    { href: '/po/review', label: 'PO Review', roles: ['po', 'admin'] },
    { href: '/admin/areas', label: 'Admin', roles: ['admin'] },
  ] as const;

  const visibleItems = user ? items.filter((item) => item.roles.includes(user.role)) : [];

  return (
    <nav style={{ display: 'grid', gap: 12 }}>
      {visibleItems.map((item) => (
        <Link key={item.href} href={item.href} style={{ color: 'white', textDecoration: 'none' }}>{item.label}</Link>
      ))}
      {!user ? <Link href="/login" style={{ color: 'white' }}>Login</Link> : null}
    </nav>
  );
}
