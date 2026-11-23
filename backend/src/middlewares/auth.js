import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  // Look for the token in the HTTP-only cookie
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  
  try {
    // Verify the token and attach the user ID to the request
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
