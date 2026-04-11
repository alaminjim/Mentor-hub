import { Request, Response } from "express";
import { BookmarkService } from "./bookmark.service";

const toggleBookmark = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!tutorId) {
      return res.status(400).json({ success: false, message: "Tutor ID is required" });
    }

    const result = await BookmarkService.toggleBookmark(userId, tutorId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: { bookmarked: result.bookmarked },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: [] });
    }

    const result = await BookmarkService.getBookmarksByUser(userId);
    const tutorIds = result.map((b) => b.tutorId);

    res.status(200).json({
      success: true,
      message: "Bookmarks fetched successfully",
      data: tutorIds, // Return just array of bookmarked tutor IDs for fast checking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
};

export const BookmarkController = {
  toggleBookmark,
  getMyBookmarks,
};
