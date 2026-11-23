export async function embedBatch(texts) {
  if (!process.env.JINA_API_KEY) throw new Error("JINA_API_KEY is not configured");
  const out = [];
  for (const t of texts) {
    try {
      const response = await fetch("https://api.jina.ai/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.JINA_API_KEY}`
        },
        body: JSON.stringify({
          model: "jina-embeddings-v2-base-en",
          input: [t]
        })
      });
      
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const reason = data?.detail || data?.message || response.statusText || "Request failed";
        throw new Error(`Jina embeddings failed (${response.status}): ${reason}`);
      }
      const embedding = data?.data?.[0]?.embedding;
      if (!Array.isArray(embedding) || embedding.length !== 768) {
        throw new Error("Jina returned an invalid embedding; expected 768 values");
      }
      out.push(embedding);
      
      // Small delay for rate limits
      await new Promise(resolve => setTimeout(resolve, 100)); 
    } catch (error) {
      console.error("❌ Jina Embedding Error:", error.message);
      throw error; 
    }
  }
  return out;
}
