import { Router } from "express";
import { register, login, logout, currentUser } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const r = Router();

r.post("/register", register);
r.post("/login", login);
r.post("/logout", logout);
r.get("/me", requireAuth, currentUser);

export default r;
