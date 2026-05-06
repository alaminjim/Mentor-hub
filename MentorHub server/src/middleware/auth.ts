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
      
      // Check for better-auth cookies (with or without _Secure- prefix)
      const hasSessionToken = cookieHeader?.includes("better-auth.session_token") || cookieHeader?.includes("_Secure-better-auth.session_token");
      console.log("[Auth Middleware] Has session token:", hasSessionToken);

      // Build headers object for better-auth
      const headers = new Headers();
      
      // Copy all request headers
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) {
          const headerValue = Array.isArray(value) ? value[0] : value;
          if (headerValue) {
            headers.set(key, headerValue);
          }
        }
      });

      // Ensure cookie header is set
      if (cookieHeader) {
        headers.set("cookie", cookieHeader);
      }

      // Handle session retrieval
      const session = await betterAuth.api.getSession({
        headers: headers as any,
      });

      console.log("[Auth Middleware] Session found:", !!session?.user);

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

