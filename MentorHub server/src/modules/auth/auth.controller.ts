import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { auth } from "../../lib/auth";
import { Role } from "../../types/role";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await authService.authGetMe(session.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status === "BANNED") {
      return res.status(403).json({
        success: false,
        message: "Account is banned",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req?.user;
    const result = await authService.getAll(
      user?.id as string,
      user?.role as Role,
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { statusId } = req.params;
    const currentUser = req.user;

    if (!currentUser) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const result = await authService.updateStatus(
      statusId as string,
      currentUser as any,
      req.body,
    );

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    next(error);
  }
};

const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await authService.adminStatsService();
    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    next(error);
  }
};

export const authController = {
  getMe,
  getAll,
  updateStatus,
  getAdminStats,
};
