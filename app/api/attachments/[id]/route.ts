import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { deleteAttachment, getAttachmentById, getInitiativeById } from '@/lib/repositories';
import { deleteAttachmentFile, readAttachmentFile } from '@/lib/storage';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(['clerk', 'po', 'admin']);
  const { id } = await params;
  const attachment = await getAttachmentById(id);
  if (!attachment) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Attachment not found' } }, { status: 404 });

  try {
    const file = await readAttachmentFile(attachment.storagePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': attachment.mimeType ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${attachment.fileName}"`,
      },
    });
  } catch {
    return new Response(`Stored file missing for ${attachment.fileName}`, {
      headers: {
        'Content-Type': attachment.mimeType ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${attachment.fileName}"`,
      },
    });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(['clerk', 'po', 'admin']);
  const { id } = await params;
  const attachment = await getAttachmentById(id);
  if (!attachment) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Attachment not found' } }, { status: 404 });
  const initiative = await getInitiativeById(attachment.initiativeId);
  if (!initiative?.isActive) return NextResponse.json({ error: { code: 'INITIATIVE_ARCHIVED', message: 'Attachments cannot be modified for archived initiatives.' } }, { status: 409 });
  const ok = await deleteAttachment(id);
  if (!ok) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Attachment not found' } }, { status: 404 });
  await deleteAttachmentFile(attachment.storagePath);
  return NextResponse.json({ data: { success: true } });
}
