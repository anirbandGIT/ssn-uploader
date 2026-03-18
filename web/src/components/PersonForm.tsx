import { useEffect, useState } from "react";

import { apiGet, uploadFetch } from "../services";
import { createPersonSchema, fileSchema } from "@repo/validation";
import { downloadSSNTemplate, formatSize, splitFile } from "../helpers";

// * FLOW
// 1. create person → get personId without this you have orphan files
// 2. upload files (parallel)
// 3. each upload attaches to personId
export default function PersonForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    ssn: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [ssnFile, setSsnFile] = useState<File | null>(null);
  const [ssnPreview, setSsnPreview] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if (ssnPreview) URL.revokeObjectURL(ssnPreview);
    };
  }, [ssnPreview]);

  const [csvFile, setCsvFile] = useState<File | null>(null);

  function validateFile(file: File, type: "ssn_image" | "csv") {
    return fileSchema.parse({
      type,
      mimeType: file.type,
      size: file.size,
    });
  }

  async function uploadAsSingle(
    file: File,
    personId: string,
    type: "ssn_image" | "csv",
  ) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("personId", personId);
    formData.append("type", type);

    await uploadFetch("/upload/single", {
      method: "POST",
      body: formData,
    });
  }

  async function uploadFileAsMultipart(
    file: File,
    personId: string,
    type: "ssn_image" | "csv",
  ) {
    // start upload
    const { uploadId, path } = await uploadFetch<{
      uploadId: string;
      path: string;
    }>("/upload/multipart/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId,
        fileName: file.name,
        mimeType: file.type,
      }),
    });

    // split file
    const chunks = splitFile(file);

    // let uploaded = 0;
    // upload chunks in parallel
    const parts = await Promise.all(
      chunks.map(async (chunk, index) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("uploadId", uploadId);
        formData.append("path", path);
        formData.append("partNumber", String(index + 1));

        const { etag } = await uploadFetch<{ etag: string }>(
          "/upload/multipart/part",
          {
            method: "POST",
            body: formData,
          },
        );

        // uploaded++;
        // optional progress
        // setProgress(Math.round((uploaded / chunks.length) * 100))

        return {
          partNumber: index + 1,
          etag,
        };
      }),
    );

    // complete upload
    await uploadFetch("/upload/multipart/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadId,
        path,
        parts,
        personId,
        type,
        fileSize: file.size,
      }),
    });
  }

  async function uploadSmart(
    file: File,
    personId: string,
    type: "ssn_image" | "csv",
  ) {
    // ! minIO min initial chunk should be 5MB
    if (file.size < 5 * 1024 * 1024)
      return uploadAsSingle(file, personId, type);
    else return uploadFileAsMultipart(file, personId, type);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // validate person form
      const result = createPersonSchema.safeParse(form);
      if (!result.success) {
        const errors: Record<string, string> = {};

        result.error.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          errors[key] = issue.message;
        });

        setFieldErrors(errors);
        return;
      }

      setFieldErrors({});
      const parsed = result.data;

      // file presence check
      if (!ssnFile) throw new Error("SSN image required");
      if (!csvFile) throw new Error("CSV file required");

      // validate files using shared schema
      validateFile(ssnFile, "ssn_image");
      validateFile(csvFile, "csv");

      // 1. create person
      const personRes = await apiGet<{ personId: string }>("/persons", {
        method: "POST",
        body: JSON.stringify(parsed),
      });

      const personId = personRes.personId;

      // 2. upload files (parallel)
      await Promise.all([
        uploadSmart(ssnFile, personId, "ssn_image"),
        uploadSmart(csvFile, personId, "csv"),
      ]);

      alert("Upload completed!");
    } catch (err: unknown) {
      console.log(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 300,
      }}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>First and last name</label>
      <input
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        required
      />
      {fieldErrors.firstName && (
        <p style={{ color: "red" }}>{fieldErrors.firstName}</p>
      )}

      <input
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        required
      />
      {fieldErrors.lastName && (
        <p style={{ color: "red" }}>{fieldErrors.lastName}</p>
      )}

      <label>Phone</label>
      <input
        placeholder="Phone"
        value={form.phoneNumber}
        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        required
      />
      {fieldErrors.phoneNumber && (
        <p style={{ color: "red" }}>{fieldErrors.phoneNumber}</p>
      )}

      <label>SSN</label>
      <input
        placeholder="SSN"
        value={form.ssn}
        onChange={(e) => setForm({ ...form, ssn: e.target.value })}
      />
      {fieldErrors.ssn && <p style={{ color: "red" }}>{fieldErrors.ssn}</p>}

      {/* SSN Image */}
      <label>SSN Image (JPEG/PNG)</label>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setSsnFile(file);

          if (file) {
            const url = URL.createObjectURL(file);
            setSsnPreview(url);
          } else {
            setSsnPreview(null);
          }
        }}
        required
      />
      {ssnFile && (
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <p>
            <strong>Name:</strong> {ssnFile.name}
          </p>
          <p>
            <strong>Size:</strong> {formatSize(ssnFile.size)}
          </p>

          {ssnPreview && (
            <img
              src={ssnPreview}
              alt="SSN Preview"
              style={{ width: 150, marginTop: 10, borderRadius: 8 }}
            />
          )}

          <button
            type="button"
            onClick={() => {
              setSsnFile(null);
              setSsnPreview(null);
            }}
          >
            REMOVE
          </button>
        </div>
      )}

      {/* CSV */}
      <button
        type="button"
        onClick={downloadSSNTemplate}
        style={{ marginBottom: 10 }}
      >
        DOWNLOAD CSV TEMPLATE
      </button>

      <label>CSV File</label>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
      />
      {csvFile && (
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <p>
            <strong>Name:</strong> {csvFile.name}
          </p>
          <p>
            <strong>Size:</strong> {formatSize(csvFile.size)}
          </p>

          <button type="button" onClick={() => setCsvFile(null)}>
            REMOVE
          </button>
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "SUBMITTING ..." : "SUBMIT"}
      </button>
    </form>
  );
}
