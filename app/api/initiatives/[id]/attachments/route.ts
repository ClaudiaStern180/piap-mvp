import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { createAttachment, getInitiativeById, listAttachments } from '@/lib/repositories';
import { saveAttachmentFile } from '@/lib/storage';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(['clerk', 'po', 'admin']);
  const { id } = await params;
  const initiative = await getInitiativeById(id);
  if (!initiative) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Initiative not found' } }, { status: 404 });
  return NextResponse.json({ data: await listAttachments(id) });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(['clerk', 'po', 'admin']);
  const { id } = await params;
  const initiative = await getInitiativeById(id);
  if (!initiative) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Initiative not found' } }, { status: 404 });
  if (!initiative.isActive) return NextResponse.json({ error: { code: 'INITIATIVE_ARCHIVED', message: 'Attachments cannot be modified for archived initiatives.' } }, { status: 409 });

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'A file field is required.' } }, { status: 400 });
  }
  const saved = await saveAttachmentFile(id, file);
  const data = await createAttachment(id, {
    fileName: saved.fileName,
    mimeType: saved.mimeType,
    fileSizeBytes: saved.fileSizeBytes,
    storagePath: saved.storagePath,
  });
  return NextResponse.json({ data }, { status: 201 });
}
