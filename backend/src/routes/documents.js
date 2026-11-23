import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.js";
import Document from "../models/Document.js";
import { PDFParse } from "pdf-parse";
import { chunkText } from "../services/chunker.js";
import { embedBatch } from "../services/embeddingService.js";
import { qdrant, COLLECTION } from "../services/qdrantService.js";
import { randomUUID } from "node:crypto";

// Store file in memory (RAM) instead of saving to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype !== "application/pdf" &&
      !file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      const error = new Error("Only PDF files are supported");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

const r = Router();

r.post("/upload", requireAuth, upload.single("pdf"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // 1. Create the document record in MongoDB
    const doc = await Document.create({
      userId: req.user.id,
      filename: req.file.originalname,
      status: "processing",
    });
    req.documentId = doc._id;

    // pdf-parse v2 exposes a parser class rather than a callable function.
    // PDFParse is class so create object and pass data,
    const parser = new PDFParse({ data: req.file.buffer });
    let parsed;
    let pageCount;
    try {


/*
      data  comes with pages that is array of pages 
      it return a object 

      {
      pages: [
        { num: 1, text: "Page 1 content..." },
        { num: 2, text: "Page 2 content..." },
        { num: 3, text: "Page 3 content..." }
      ],

      total: 3,

      text: "Page 1 content... Page 2 content... Page 3 content..."
}
*/
      parsed = await parser.getText();
      pageCount = parsed.total;
    } finally {
      await parser.destroy();
    }

    // 3. Chunk the text
    // without flatmap we will get array of array of chunks for each page, but we want a single array of chunks with page number 
    const chunks = parsed.pages.flatMap((page) =>
      chunkText(page.text, { chunkSize: 2000, overlap: 0.1 }).map((text) => ({
        text,
        page: page.num,
      })),
    );
    if (!chunks.length) {
      await Document.findByIdAndUpdate(doc._id, { status: "failed" });
      return res
        .status(422)
        .json({ error: "No readable text was found in this PDF" });
    }

    console.log(
      `📄 Parsed ${req.file.originalname}: found ${chunks.length} chunks.`,
    );

    const vectors = await embedBatch(chunks.map((chunk) => chunk.text));
    await qdrant.upsert(COLLECTION, {
      wait: true,
      points: chunks.map((chunk, i) => ({
        id: randomUUID(),
        vector: vectors[i],
        payload: {
          userId: String(req.user.id),
          docId: String(doc._id),
          filename: req.file.originalname,
          page: chunk.page,
          text: chunk.text,
        },
      })),
    });
    await Document.findByIdAndUpdate(doc._id, {
      status: "ready",
      pageCount,
    });

    res.status(201).json({
      message: "File processed successfully",
      docId: doc._id,
      chunksFound: chunks.length,
    });
  } catch (e) {
    if (req.documentId)
      await Document.findByIdAndUpdate(req.documentId, {
        status: "failed",
      }).catch(() => {});
    console.error(e);
    next(e);
  }
});

r.get("/", requireAuth, async (req, res, next) => {
  try {
    const docs = await Document.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(docs);
  } catch (error) {
    return next(error);
  }
});

export default r;
