import { NextRequest, NextResponse } from 'next/server';
import { getDemoUserByRole } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const role = String(body?.role || '');
  const user = getDemoUserByRole(role);

  if (!user) {
    return NextResponse.json({ error: { code: 'INVALID_ROLE', message: 'Invalid demo role.' } }, { status: 400 });
  }

  const response = NextResponse.json({ data: user });
  response.cookies.set('demo_role', user.role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
