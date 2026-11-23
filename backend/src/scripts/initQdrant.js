import "dotenv/config";
import { ensureCollection } from "../services/qdrantService.js";

try {
  await ensureCollection();
  console.log("✅ Qdrant collection and userId index are ready");
} catch (error) {
  console.error("❌ Qdrant initialization failed:", error.message);
  process.exitCode = 1;
}
