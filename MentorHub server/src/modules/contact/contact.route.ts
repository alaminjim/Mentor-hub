import { Router } from "express";
import { handleContactSubmit } from "./contact.controller";

export const contactRouter = Router();

contactRouter.post("/", handleContactSubmit);
