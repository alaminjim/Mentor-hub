import { Request, Response } from "express";
import { categoryService } from "./categories.service";

const createCategory = async (req: Request, res: Response) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getCategory();
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

const updateCategory = async (req: Request, res: Response) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const categoryController = {
  createCategory,
  getCategory,
  updateCategory,
};
