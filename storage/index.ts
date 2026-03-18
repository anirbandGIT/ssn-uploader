import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT || 9_000),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "",
  secretKey: process.env.MINIO_SECRET_KEY || "",
});

const BUCKET = process.env.MINIO_BUCKET || "ssn-documents";
export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET);

  if (!exists) await minioClient.makeBucket(BUCKET, "us-east-1");
}

export async function uploadFile(
  path: string,
  buffer: Buffer,
  mimeType: string,
) {
  const bucket = process.env.MINIO_BUCKET || "ssn-documents";

  // putObject(bucket, objectName, stream, size?, metaData?)
  await minioClient.putObject(bucket, path, buffer, buffer.length, {
    "Content-Type": mimeType,
  });

  return path;
}

// * FLOW
// start upload → get uploadId
// uploadPart → send chunks 1,2,3 ...
// complete → stitch all parts together
export async function createMultipartUpload(path: string, mimeType: string) {
  const bucket = process.env.MINIO_BUCKET || "ssn-documents";

  const uploadId = await minioClient.initiateNewMultipartUpload(bucket, path, {
    "Content-Type": mimeType,
  });

  return uploadId;
}

export async function uploadPart(params: {
  path: string;
  uploadId: string;
  partNumber: number;
  buffer: Buffer;
}) {
  const bucket = process.env.MINIO_BUCKET || "ssn-documents";

  // eTag here is an unique has for uploaded chunk
  const result = await minioClient.uploadPart(
    {
      bucketName: bucket,
      objectName: params.path,
      uploadID: params.uploadId,
      partNumber: params.partNumber,
      headers: {
        "Content-Type": "application/octet-stream", // minimal headers
      },
    },
    params.buffer,
  );

  console.log("Uploaded part:", params.partNumber, result.etag);
  return result.etag;
}

export async function completeMultipartUpload(params: {
  path: string;
  uploadId: string;
  parts: { partNumber: number; etag: string }[];
}) {
  const bucket = process.env.MINIO_BUCKET || "ssn-documents";

  // transform to SDK format
  const etags = params.parts.map((p) => {
    if (!p.etag) throw new Error(`Missing etag for part ${p.partNumber}`);

    return {
      part: p.partNumber,
      etag: p.etag,
    };
  });

  // ensure sorted order
  etags.sort((a, b) => a.part - b.part);
  console.log("Completing upload with parts:", etags);

  const result = await minioClient.completeMultipartUpload(
    bucket,
    params.path,
    params.uploadId,
    etags, // should be sorted
  );

  return result;
}
