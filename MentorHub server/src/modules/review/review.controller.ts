import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import { Role } from "../../types/role";

const createReview = async (
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

    const payload = {
      studentId: user.id,
      tutorId: req.body.tutorId,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };

    const result = await reviewService.createReview(payload);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewId } = req.params;

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await reviewService.updateReview(
      user?.id,
      reviewId as string,
      user?.role as Role,
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

const getReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.getReview();

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getOwnReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await reviewService.getOwnReview(user?.id, user?.role);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { deleteId } = req.params;

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await reviewService.deleteReview(
      user?.id,
      deleteId as string,
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

export const reviewController = {
  createReview,
  updateReview,
  getReview,
  deleteReview,
  getOwnReview,
};
