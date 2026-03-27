import { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { SessionActions } from '@/components/layout/SessionActions';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f7f7f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
          <aside style={{ background: '#111827', color: 'white', padding: 24, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginTop: 0 }}>PIAP MVP</h2>
            <SidebarNav user={user} />
            <div style={{ marginTop: 'auto' }}>
              <SessionActions user={user} />
            </div>
          </aside>
          <main style={{ padding: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
