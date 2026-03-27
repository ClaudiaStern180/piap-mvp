import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ data: { success: true } });
  response.cookies.set('demo_role', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
