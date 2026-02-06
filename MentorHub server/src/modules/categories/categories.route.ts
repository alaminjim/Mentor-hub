import express from "express";
import { categoryController } from "./categories.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

router.post("/create", auth(Role.ADMIN), categoryController.createCategory);

router.get("/", categoryController.getCategory);

router.put(
  "/update/:createId",
  auth(Role.ADMIN),
  categoryController.updateCategory,
);

export const categoryRouter = router;
