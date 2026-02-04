import { NextFunction, Request, Response } from "express";
import { Role } from "../types/role";
import { auth as betterAuth } from "../lib/auth";
import { Status } from "../../generated/prisma/enums";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

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
      return res.status(500).json({
        success: false,
        message: "Authentication error",
        error: error.message,
      });
    }
  };
};

export default auth;
