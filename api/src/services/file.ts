import { randomUUID } from "crypto";

import { db, updateFileMetadata } from "@repo/db";
import { files, auditLogs } from "@repo/db/schema";
import { uploadFile } from "@repo/storage";
import { generateChecksum, sanitizeFilename } from "../utils";

export async function uploadSingleFile(params: {
  file: Express.Multer.File;
  personId: string;
  type: "ssn_image" | "csv";
}) {
  const { file, personId, type } = params;

  const checksum = generateChecksum(file.buffer);

  // sanitize the file and and determine path
  const sanitizedName = sanitizeFilename(file.originalname);
  const path = `users/${personId}/${sanitizedName}`;

  // minIO automatically overwrites on same path
  await uploadFile(path, file.buffer, file.mimetype);

  const existing = await db.query.files.findFirst({
    where: (f, { eq, and }) => and(eq(f.personId, personId), eq(f.path, path)),
  });

  if (existing) {
    // update existing record
    await updateFileMetadata({
      fileId: existing.id,
      mimeType: file.mimetype,
      fileSize: file.size,
      checksum,
    });

    // audit log
    // TODO: move to db helper
    await db.insert(auditLogs).values({
      personId,
      action: "FILE_OVERWRITTEN",
      metadata: JSON.stringify({
        path,
        fileSize: file.size,
      }),
    });

    return {
      fileId: existing.id,
      path,
      overwritten: true,
    };
  }

  // otherwise insert new record
  const fileId = randomUUID();

  await db.insert(files).values({
    id: fileId,
    personId,
    type,
    mimeType: file.mimetype,
    fileSize: file.size,
    checksum,
    path,
  });

  // audit log
  // TODO: move to db helper
  await db.insert(auditLogs).values({
    personId,
    action: "FILE_UPLOADED",
    metadata: JSON.stringify({
      path,
      fileSize: file.size,
    }),
  });

  return {
    fileId,
    path,
    overwritten: false,
  };
}
