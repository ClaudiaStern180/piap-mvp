import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getDashboardSummary } from '@/lib/repositories';

export async function GET(request: NextRequest) {
  await requireRole(['clerk', 'po', 'admin']);
  const params = request.nextUrl.searchParams;
  return NextResponse.json({
    data: await getDashboardSummary({
      targetYear: params.get('targetYear'),
      areaId: params.get('areaId'),
      categoryId: params.get('categoryId'),
    }),
  });
}
