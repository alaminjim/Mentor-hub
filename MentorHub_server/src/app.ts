import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { tutorRouter } from "./modules/tutor/tutor.route.js";
import { reviewRouter } from "./modules/review/review.route.js";
import { studentRouter } from "./modules/students/student.route.js";
import { categoryRouter } from "./modules/categories/categories.route.js";
import { bookingsRouter } from "./modules/bookings/bookings.route.js";
import { blogRouter } from "./modules/blog/blog.route.js";
import { statsRouter } from "./modules/stats/stats.route.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { bookmarkRouter } from "./modules/bookmark/bookmark.route.js";
import { pricingRouter } from "./modules/pricing/pricing.route.js";
import { aiRouter } from "./modules/ai/ai.route.js";
import testRouter from "./modules/test/test.route.js";
import { notFound } from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Trust proxy is required for secure cookies on Render
app.set("trust proxy", 1);

app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PROD_CLIENT_URL,
  "http://localhost:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL,
      process.env.PROD_CLIENT_URL,
    ].filter(Boolean) as string[],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-requested-with"],
  })
);

app.use("/api/auth", authRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/review", reviewRouter);
app.use("/api/student", studentRouter);
app.use("/api/category", categoryRouter);
app.use("/api/booking", bookingsRouter);
app.use("/api/blog", blogRouter);
app.use("/api/stats", statsRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookmark", bookmarkRouter);
app.use("/api/pricing", pricingRouter);
app.use("/api/ai", aiRouter);
app.use("/api/test", testRouter);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "SkillBridge API Running" });
});

app.use(notFound);
app.use(errorHandler);

export default app;