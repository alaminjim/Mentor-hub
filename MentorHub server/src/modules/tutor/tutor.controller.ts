import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { Role } from "../../types/role";

const tutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

const updateTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

const updateModerateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

const getAllTutorProfileFilter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, sortBy, sortOrder } = req.query;

    const searchBySubjects = search ? (search as string).split(",") : [];

    const result = await tutorService.getAllTutorProfileFilter({
      subject: searchBySubjects,
      sortBy: (sortBy as string) || undefined,
      sortOrder: (sortOrder as string) || undefined,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await tutorService.getAllTutorProfile();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllTutorProfileOwn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

const getTutorDashboard = async (
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

    if (user.role !== "TUTOR") {
      return res.status(403).json({
        success: false,
        message: "Only tutors can access this dashboard",
      });
    }

    const dashboardData = await tutorService.getTutorDashboard(user.id);

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error: any) {
    next(error);
  }
};

export const tutorProfileController = {
  tutorProfile,
  updateTutorProfile,
  getAllTutorProfile,
  getAllTutorProfileOwn,
  updateModerateAvailability,
  getTutorDashboard,
  getAllTutorProfileFilter,
};
