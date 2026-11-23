import { chunkText } from "../src/services/chunker.js";

test("splits text into overlapping chunks", () => {
  const text = "a".repeat(10000);
  // chunkSize 2000, overlap 10% means step is 1800
  const chunks = chunkText(text, { chunkSize: 2000, overlap: 0.1 });
  
  // It should take 6 chunks to cover 10,000 characters
  expect(chunks.length).toBeGreaterThan(1);
  
  // Ensure no chunk is larger than the chunkSize
  chunks.forEach(c => expect(c.length).toBeLessThanOrEqual(2000));
});