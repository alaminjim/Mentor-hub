import { Request, Response } from "express";
import { student_bookingService } from "./student.service";
import { Role } from "../../types/role";

const manageProfile = async (req: Request, res: Response) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProfile = async (req: Request, res: Response) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const student_bookingController = {
  manageProfile,
  deleteProfile,
};
