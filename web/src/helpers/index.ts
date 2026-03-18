export function formatSize(size: number) {
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
  return (size / (1024 * 1024)).toFixed(1) + " MB";
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 1MB
export function splitFile(file: File) {
  const chunks: Blob[] = [];
  let start = 0;

  while (start < file.size) {
    chunks.push(file.slice(start, start + CHUNK_SIZE));
    start += CHUNK_SIZE;
  }

  return chunks;
}

export function downloadSSNTemplate() {
  const headers = [
    "First name",
    "Last name",
    "Phone",
    "Email",
    "Gender (M/F)",
    "Marital status (Y/N)",
    "DOB",
    "SSN",
    "SSN issue date",
  ];

  const csvContent = headers.join(",");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "SSN_DETAILS.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
