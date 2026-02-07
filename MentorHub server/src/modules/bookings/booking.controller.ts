import { Request, Response } from "express";
import { bookingsService } from "./booking.service";

const createBookings = async (req: Request, res: Response) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await bookingsService.createBookings(
      user?.id as string,
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

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const filter = req.query.filter as "upcoming" | "past" | undefined;

    const result = await bookingsService.getBookings(
      user.id,
      user.role,
      filter,
    );

    res.status(200).json({
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

const moderateStatus = async (req: Request, res: Response) => {
  try {
    const { statusId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await bookingsService.moderateStatus(
      req.body,
      user?.role,
      statusId as string,
    );
    res.status(200).json({
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

export const bookingsController = {
  createBookings,
  getBookings,
  moderateStatus,
};
