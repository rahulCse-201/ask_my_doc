import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY || undefined,
});

export const COLLECTION = "chunks";

export async function ensureCollection() {
  // all collections get 
  const { collections } = await qdrant.getCollections();

  //  find particular collection 
  if (!collections.some((collection) => collection.name === COLLECTION)) {
    await qdrant.createCollection(COLLECTION, { vectors: { size: 768, distance: "Cosine" } });
  }
  try {
    await qdrant.createPayloadIndex(COLLECTION, { field_name: "userId", field_schema: "keyword", wait: true });
  } catch (error) {
    if (!String(error.message).toLowerCase().includes("already exists")) throw error;
  }
}
