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
      message: error.message || "Failed to update resource",
    });
  }
};

const updateModerateAvailability = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        error: "unAuthorized",
      });
    }

    const result = await tutorService.updateModerateAvailability(
      tutorId as string,
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
      message: error.message || "Failed to update resource",
    });
  }
};

const getAllTutorProfile = async (req: Request, res: Response) => {
  try {
    const { search, sortBy, sortOrder } = req.query;

    const searchBySubjects = search ? (search as string).split(",") : [];

    const result = await tutorService.getAllTutorProfile({
      subject: searchBySubjects,
      sortBy: (sortBy as string) || undefined,
      sortOrder: (sortOrder as string) || undefined,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllTutorProfileOwn = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: "Tutor id is required",
      });
    }
    const result = await tutorService.getAllTutorProfileOwn(tutorId as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const tutorProfileController = {
  tutorProfile,
  updateTutorProfile,
  getAllTutorProfile,
  getAllTutorProfileOwn,
  updateModerateAvailability,
};
