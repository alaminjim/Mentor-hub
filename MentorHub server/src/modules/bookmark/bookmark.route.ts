import express from "express";
import { BookmarkController } from "./bookmark.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.post(
  "/toggle",
  auth(Role.STUDENT, Role.TUTOR, Role.ADMIN),
  BookmarkController.toggleBookmark
);

router.get(
  "/my-bookmarks",
  auth(Role.STUDENT, Role.TUTOR, Role.ADMIN),
  BookmarkController.getMyBookmarks
);

export const bookmarkRouter = router;
