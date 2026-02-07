import { NextFunction, Request, Response } from "express";
import { categoryService } from "./categories.service";

const createCategory = async (
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
    const result = await categoryService.createCategory(user?.role, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getCategory();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { createId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await categoryService.updateCategory(
      createId as string,
      user?.role,
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

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { deleteId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await categoryService.deleteCategory(
      deleteId as string,
      user?.role,
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const categoryController = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
