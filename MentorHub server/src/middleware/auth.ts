import { NextFunction, Request, Response } from "express";
import { Role } from "../types/role.js";
import { auth as betterAuth } from "../lib/auth.js";
import { Status } from "@prisma/client";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Debug: log cookie header
      const cookieHeader = req.headers.cookie;
      console.log("[Auth Middleware] Cookie header:", cookieHeader ? cookieHeader.substring(0, 200) : "missing");
      console.log("[Auth Middleware] Request path:", req.path);
      console.log("[Auth Middleware] Origin:", req.headers.origin);
      
      // Handle session retrieval by passing original headers directly
      // better-auth will automatically handle cookie parsing based on the request context
      let session = null;
      try {
        // We pass the full headers object which includes Cookies, Authorization, etc.
        session = await betterAuth.api.getSession({
          headers: req.headers as any,
        });
      } catch (err: any) {
        // If Prisma fails with a delete error or record not found, we treat it as no session
        console.warn("[Auth Middleware] Session decoding failed (possible stale cookie):", err.message);
        session = null;
      }

      if (!session?.user) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      }

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as Role,
        status: session.user.status as Status,
      };

      if (req.user.status === "BANNED") {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned",
        });
      }

      if (roles.length && !roles.includes(req.user.role as Role)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resource",
        });
      }

      next();
    } catch (error: any) {
      console.error("Authentication Middleware Error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication error",
        error: error.message,
      });
    }
  };
};

export default auth;

