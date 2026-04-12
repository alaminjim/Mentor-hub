import express from "express";
import { BookmarkController } from "./bookmark.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.post(
  "/toggle",
  auth(), // সব authenticated user পারবে
  BookmarkController.toggleBookmark
);

router.get(
  "/my-bookmarks",
  auth(), // MANAGER, VENDOR, ORGANIZER সহ সবাই পারবে
  BookmarkController.getMyBookmarks
);

export const bookmarkRouter = router;
