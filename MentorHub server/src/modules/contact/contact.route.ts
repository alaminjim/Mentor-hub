import { Router } from "express";
import { handleContactSubmit } from "./contact.controller.js";

export const contactRouter = Router();

contactRouter.post("/", handleContactSubmit);
