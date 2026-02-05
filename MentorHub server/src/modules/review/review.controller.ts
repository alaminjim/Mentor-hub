import { Request, Response } from "express";
import { reviewService } from "./review.service";
import { Role } from "../../types/role";

const createReview = async (req: Request, res: Response) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReview = async (req: Request, res: Response) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await reviewService.getReview(user?.id, user?.role as Role);

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

const deleteReview = async (req: Request, res: Response) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewController = {
  createReview,
  updateReview,
  getReview,
  deleteReview,
};
