import { eq } from "drizzle-orm";

import { files } from "../schema/index.js";
import { db } from "../client.js";

export async function updateFileMetadata(params: {
  fileId: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
}) {
  const { fileId, mimeType, fileSize, checksum } = params;

  await db
    .update(files)
    .set({
      mimeType,
      fileSize,
      checksum,
      updatedAt: new Date(),
    })
    .where(eq(files.id, fileId));
}
