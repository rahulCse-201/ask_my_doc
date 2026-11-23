import { embedBatch } from "./embeddingService.js";
import { qdrant, COLLECTION } from "./qdrantService.js";
import { groq, MODEL } from "./llmService.js";
import Document from "../models/Document.js";

const SYSTEM_PROMPT = `You answer questions using ONLY the provided context. 
Cite sources as [filename, page N]. If the answer is not in the context, say:
"I don't know based on the provided documents."`;

export async function answerQuestion({ userId, question, topK = 5 }) {
  const normalizedQuestion = typeof question === "string" ? question.trim() : "";
  if (!normalizedQuestion) {
    const error = new Error("Question is required");
    error.status = 400;
    throw error;
  }
  if (normalizedQuestion.length > 2000) {
    const error = new Error("Question must be 2000 characters or fewer");
    error.status = 400;
    throw error;
  }

  const readyDocuments = await Document.find({ userId, status: "ready" }).select("_id").lean();
  if (!readyDocuments.length) {
    return { answer: "Upload a PDF and wait for it to finish processing before asking questions.", citations: [] };
  }

  // 1. Embed the user's question using Jina
  const [qvec] = await embedBatch([normalizedQuestion]);

  // 2. Search Qdrant using the updated SDK method
  const searchResult = await qdrant.query(COLLECTION, {
    query: qvec, 
    limit: topK,
    filter: {
      must: [
        { key: "userId", match: { value: userId.toString() } },
        { key: "docId", match: { any: readyDocuments.map((doc) => String(doc._id)) } },
      ],
    },
    with_payload: true,
  });

  const results = searchResult.points;

  // 3. If no chunks found, refuse to answer
  if (!results || results.length === 0) {
    return { 
      answer: "I don't know based on the provided documents.", 
      citations: [] 
    };
  }

  // 4. Build the context string
  const context = results.map((r, i) =>
    `[${i + 1}] (${r.payload.filename}, page ${r.payload.page})\n${r.payload.text}`
  ).join("\n\n");

  // 5. Call Groq
  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${normalizedQuestion}` },
    ],
  });

  // 6. Return the answer and the citations
  const citations = results.map(r => ({
    filename: r.payload.filename,
    page: r.payload.page,
    docId: r.payload.docId,
    chunkIndex: r.payload.chunkIndex,
  }));

  return { answer: completion.choices[0].message.content, citations };
}
