import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const cookieSameSite = process.env.COOKIE_SAME_SITE || "none";
const cookieSecure = process.env.NODE_ENV === "production" || cookieSameSite === "none";

const cookieBaseOpts = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: cookieSecure,
};

const cookieOpts = {
  ...cookieBaseOpts,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function clearAuthCookie(res) {
  res.clearCookie("token", cookieBaseOpts);
}

function normalizedEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function createToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return { id: user._id, email: user.email };
}

export async function register(req, res, next) {
  try {
    const email = normalizedEmail(req.body?.email);
    const password = req.body?.password;
    if (!email || typeof password !== "string") return res.status(400).json({ error: "Email and password are required" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Enter a valid email address" });
    if (password.length < 8 || password.length > 72) return res.status(400).json({ error: "Password must be between 8 and 72 characters" });
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already taken" });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    
    const token = createToken(user._id);
    res.cookie("token", token, cookieOpts).status(201).json(publicUser(user));
  } catch (error) { 
    if (error?.code === 11000) return res.status(409).json({ error: "Email already taken" });
    next(error); 
  }
}

export async function login(req, res, next) {
  try {
    const email = normalizedEmail(req.body?.email);
    const password = req.body?.password;
    if (!email || typeof password !== "string") return res.status(400).json({ error: "Email and password are required" });
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = createToken(user._id);
    res.cookie("token", token, cookieOpts).json(publicUser(user));
  } catch (error) { 
    next(error); 
  }
}

export function logout(req, res) {
  clearAuthCookie(res);
  res.json({ ok: true });
}

export async function currentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("email");
    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ error: "Not authenticated" });
    }
    return res.json(publicUser(user));
  } catch (error) {
    return next(error);
  }
}
