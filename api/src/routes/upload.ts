import { Router } from "express";
import multer from "multer";

import { upload as singleUpload } from "../middlewares";
import { completeMultipartUpload } from "@repo/storage";
import { db } from "@repo/db";
import { files, auditLogs } from "@repo/db/schema";
import { sanitizeFilename, validateFile } from "../utils";
import { uploadSingleFile } from "../services";
import { createMultipartUpload, uploadPart } from "@repo/storage";
import { generateChecksum } from "../utils/crypto";
import { randomUUID } from "crypto";

const router = Router();

router.post("/single", singleUpload.single("file"), async (req, res, next) => {
  try {
    const file = req.file;
    const { personId, type } = req.body;

    if (!file) throw new Error("File missing");

    validateFile(file);

    const result = await uploadSingleFile({
      file,
      personId,
      type,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/multipart/start", async (req, res, next) => {
  try {
    const { personId, fileName, mimeType } = req.body;

    const safeName = sanitizeFilename(fileName);

    const path = `users/${personId}/${safeName}`;

    const uploadId = await createMultipartUpload(path, mimeType);

    res.json({ uploadId, path });
  } catch (err) {
    next(err);
  }
});

const multipartUpload = multer({ storage: multer.memoryStorage() });
router.post(
  "/multipart/part",
  multipartUpload.single("chunk"),
  async (req, res, next) => {
    try {
      const { uploadId, path, partNumber } = req.body;

      const file = req.file;

      if (!file) throw new Error("Chunk missing");

      const etag = await uploadPart({
        path,
        uploadId,
        partNumber: Number(partNumber),
        buffer: file.buffer,
      });

      res.json({ etag });
    } catch (err) {
      next(err);
    }
  },
);

router.post("/multipart/complete", async (req, res, next) => {
  try {
    const { uploadId, path, parts, personId, type, fileSize } = req.body;

    await completeMultipartUpload({ path, uploadId, parts });

    // no full buffer → checksum optional or skipped
    const fileId = randomUUID();

    await db.insert(files).values({
      id: fileId,
      personId,
      type,
      mimeType: "unknown",
      fileSize,
      checksum: "multipart", // placeholder
      path,
    });

    await db.insert(auditLogs).values({
      personId,
      action: "MULTIPART_UPLOAD_COMPLETED",
      metadata: JSON.stringify({ path }),
    });

    res.json({ fileId, path });
  } catch (err) {
    next(err);
  }
});

export default router;
