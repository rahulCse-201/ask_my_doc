import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { answerQuestion } from "../services/queryService.js";

const r = Router();

// GET route for easy terminal testing
r.get("/", requireAuth, async (req, res, next) => {
  try {
    const question = req.query.q;
    if (!question) return res.status(400).json({ error: "Question is required" });
    
    const result = await answerQuestion({ userId: req.user.id, question });
    res.json(result);
  } catch (e) { next(e); }
});

// POST route for the React frontend
r.post("/", requireAuth, async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });
    
    const result = await answerQuestion({ userId: req.user.id, question });
    res.json(result);
  } catch (e) { next(e); }
});

export default r;