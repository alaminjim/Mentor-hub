import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { authRouter } from "./modules/auth/auth.route";
import { tutorRouter } from "./modules/tutor/tutor.route";
import { reviewRouter } from "./modules/review/review.route";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api", authRouter);

app.use("/api/tutor", tutorRouter);

app.use("/api/review", reviewRouter);

app.all("/api/auth/*path", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.json({ message: "SkillBridge API Running" });
});

export default app;
