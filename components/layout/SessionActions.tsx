'use client';

import { User } from '@/lib/types';

export function SessionActions({ user }: { user: User | null }) {
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  if (!user) return null;

  return (
    <div style={{ display: 'grid', gap: 8, marginTop: 24, fontSize: 14 }}>
      <div style={{ color: '#d1d5db' }}>
        <div style={{ fontWeight: 700, color: 'white' }}>{user.name}</div>
        <div>{user.email}</div>
        <div style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{user.role}</div>
      </div>
      <button onClick={logout} style={{ border: '1px solid #374151', background: 'transparent', color: 'white', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', textAlign: 'left' }}>
        Logout
      </button>
    </div>
  );
}
