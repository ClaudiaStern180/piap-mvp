import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getPlannedVsAchievedByMonth } from '@/lib/repositories';

export async function GET(request: NextRequest) {
  await requireRole(['clerk', 'po', 'admin']);
  const year = request.nextUrl.searchParams.get('targetYear');
  return NextResponse.json({ data: await getPlannedVsAchievedByMonth(year ? Number(year) : undefined) });
}
