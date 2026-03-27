'use client';

import { useState } from 'react';

const roles = [
  { value: 'clerk', label: 'Sachbearbeiter / Clerk' },
  { value: 'po', label: 'PO' },
  { value: 'admin', label: 'Admin' },
];

export default function LoginPage() {
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || 'Login failed');
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f3f4f6', padding: 24 }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 420, background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, display: 'grid', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>PIAP MVP Login</h1>
          <p style={{ color: '#6b7280', marginBottom: 0 }}>Demo login with role selection.</p>
        </div>
        <label style={{ display: 'grid', gap: 8 }}>
          <span>Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }}>
            {roles.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>
        {error ? <div style={{ color: '#b91c1c', fontSize: 14 }}>{error}</div> : null}
        <button disabled={loading} type="submit" style={{ border: 0, background: '#111827', color: 'white', borderRadius: 10, padding: '12px 16px', cursor: 'pointer' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
