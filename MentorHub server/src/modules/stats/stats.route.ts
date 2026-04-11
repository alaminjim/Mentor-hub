import { Router } from "express";
import { getPlatformStats } from "./stats.controller";

export const statsRouter = Router();

statsRouter.get("/", getPlatformStats);
