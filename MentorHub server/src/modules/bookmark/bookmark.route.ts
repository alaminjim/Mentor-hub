import express from "express";
import { BookmarkController } from "./bookmark.controller.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../types/role.js";

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
