import { Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { Role } from "../../types/role";

const tutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        error: "unAuthorized",
      });
    }

    const result = await tutorService.tutorProfile(
      req.body,
      user?.id as string,
      user?.role as Role,
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create resource",
    });
  }
};

const updateTutorProfile = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        error: "unAuthorized",
      });
    }

    const result = await tutorService.updateTutorProfile(
      profileId as string,
      req.body,
      user?.role as Role,
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update resource",
    });
  }
};

export const tutorProfileController = {
  tutorProfile,
  updateTutorProfile,
};
