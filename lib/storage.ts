import { promises as fs } from 'fs';
import path from 'path';

const UPLOAD_ROOT = process.env.ATTACHMENTS_DIR || path.join(process.cwd(), '.uploads');

function sanitizeFilename(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function saveAttachmentFile(initiativeId: string, file: File) {
  const attachmentId = crypto.randomUUID();
  const safeName = sanitizeFilename(file.name || 'attachment.bin');
  const dir = path.join(UPLOAD_ROOT, 'initiatives', initiativeId, attachmentId);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return {
    attachmentId,
    fileName: safeName,
    mimeType: file.type || null,
    fileSizeBytes: buffer.byteLength,
    storagePath: filePath,
  };
}

export async function readAttachmentFile(storagePath: string) {
  return fs.readFile(storagePath);
}

export async function deleteAttachmentFile(storagePath: string) {
  try {
    await fs.unlink(storagePath);
  } catch {
    // ignore missing file during dev cleanup
  }
}
