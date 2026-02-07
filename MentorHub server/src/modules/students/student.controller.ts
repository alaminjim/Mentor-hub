import { NextFunction, Request, Response } from "express";
import { student_bookingService } from "./student.service";
import { Role } from "../../types/role";

const manageProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const user = req?.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await student_bookingService.manageProfile(
      studentId as string,
      user.role as Role,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const user = req?.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await student_bookingService.deleteProfile(
      studentId as string,
      user.role as Role,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const summary = await student_bookingService.getDashboardSummary(
      user.id,
      user.role,
    );

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    next(error);
  }
};

export const student_bookingController = {
  manageProfile,
  deleteProfile,
  getDashboardSummary,
};
