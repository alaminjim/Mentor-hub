import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { tutorRouter } from "./modules/tutor/tutor.route.js";
import { reviewRouter } from "./modules/review/review.route.js";
import { studentRouter } from "./modules/students/student.route.js";
import { categoryRouter } from "./modules/categories/categories.route.js";
import { bookingsRouter } from "./modules/bookings/bookings.route.js";
import { notFound } from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "*",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/review", reviewRouter);
app.use("/api/student", studentRouter);
app.use("/api/category", categoryRouter);
app.use("/api/booking", bookingsRouter);

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send({ message: "SkillBridge API Running" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
