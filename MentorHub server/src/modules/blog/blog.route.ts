import express, { Router } from "express";
import { BlogController } from "./blog.controller";

import {
  createBlogSchema,
  updateBlogSchema,
  blogIdSchema,
  authorIdSchema,
  categorySchema,
  searchBlogSchema,
} from "./blog.validation";
import validateRequest from "../../middleware/validateRequest";

import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router: Router = express.Router();

router.get("/", BlogController.getAllBlogs);

router.get(
  "/search/posts",
  validateRequest(searchBlogSchema),
  BlogController.searchBlogs,
);

router.get(
  "/category/:category",
  validateRequest(categorySchema),
  BlogController.getBlogsByCategory,
);

router.get(
  "/author/:authorId",
  validateRequest(authorIdSchema),
  BlogController.getBlogByAuthorId,
);

router.get("/:id", validateRequest(blogIdSchema), BlogController.getBlogById);

// Protected Routes
router.post(
  "/",
  auth(Role.ADMIN, Role.TUTOR),
  validateRequest(createBlogSchema),
  BlogController.createBlog
);

router.patch(
  "/:id",
  auth(Role.ADMIN, Role.TUTOR),
  validateRequest(blogIdSchema),
  validateRequest(updateBlogSchema),
  BlogController.updateBlog,
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(blogIdSchema),
  BlogController.deleteBlog
);

export const blogRouter = router;
