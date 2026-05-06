import { Router } from "express";

const router = Router();

// Test endpoint to debug cookies and session
router.get("/debug-cookies", (req, res) => {
  const cookieHeader = req.headers.cookie;
  console.log("[DEBUG] Raw cookie header:", cookieHeader);
  console.log("[DEBUG] All headers:", Object.keys(req.headers));
  
  res.json({
    cookieHeader: cookieHeader || "missing",
    headers: Object.keys(req.headers),
    timestamp: new Date().toISOString()
  });
});

export default router;
