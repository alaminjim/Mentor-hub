import express from "express";
import { categoryController } from "./categories.controller.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../types/role.js";

const router = express.Router();

router.post("/create", auth(Role.ADMIN), categoryController.createCategory);

router.get("/", categoryController.getCategory);

router.put(
  "/update/:createId",
  auth(Role.ADMIN),
  categoryController.updateCategory,
);

router.delete(
  "/delete/:deleteId",
  auth(Role.ADMIN),
  categoryController.deleteCategory,
);

export const categoryRouter = router;
