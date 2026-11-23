import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Ask My Docs API is running" });
});





import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/documents.js";
import queryRoutes from "./routes/query.js";
import { ensureCollection } from "./services/qdrantService.js";



app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes)
app.use("/api/query", queryRoutes);

app.use((err, req, res, _next) => {
  const status = err.name === "MulterError" ? (err.code === "LIMIT_FILE_SIZE" ? 413 : 400) : (err.status || 500);
  const message = status >= 500 ? "The request could not be completed" : err.message;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
});









const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  await connectDB();
  await ensureCollection();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("❌ Backend startup failed:", error.message);
  process.exitCode = 1;
});
