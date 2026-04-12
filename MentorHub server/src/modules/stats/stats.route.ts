import { Router } from "express";
import { getPlatformStats } from "./stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/", getPlatformStats);
