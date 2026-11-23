export function chunkText(text, { chunkSize = 2000, overlap = 0.1 } = {}) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const step = Math.max(1, Math.floor(chunkSize * (1 - overlap)));
  const chunks = [];

  for (let i = 0; i < clean.length; i += step) {
    chunks.push(clean.slice(i, i + chunkSize));
    if (i + chunkSize >= clean.length) break;
  }
  return chunks;
}
