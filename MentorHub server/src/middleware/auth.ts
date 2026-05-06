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
      
      // Check for better-auth cookies (with or without __Secure- prefix)
      const hasSessionToken = cookieHeader?.includes("better-auth.session_token") || cookieHeader?.includes("__Secure-better-auth.session_token");
      console.log("[Auth Middleware] Has session token:", hasSessionToken);

      // Process cookie header - replace __Secure- prefix for better-auth compatibility
      let processedCookieHeader = cookieHeader;
      if (cookieHeader) {
        processedCookieHeader = cookieHeader.replace(/__Secure-better-auth/g, "better-auth");
        console.log("[Auth Middleware] Processed cookie header:", processedCookieHeader.substring(0, 100));
      }

      // Build headers for better-auth (use raw object, not Headers class)
      const headersForAuth: Record<string, string> = {};
      
      // Copy headers from request
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) {
          const headerValue = Array.isArray(value) ? value[0] : value;
          if (headerValue) {
            headersForAuth[key.toLowerCase()] = headerValue;
          }
        }
      });
      
      // Override with processed cookie
      if (processedCookieHeader) {
        headersForAuth['cookie'] = processedCookieHeader;
      }

      console.log("[Auth Middleware] Headers for auth:", Object.keys(headersForAuth));

      // Handle session retrieval
      const session = await betterAuth.api.getSession({
        headers: headersForAuth,
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

