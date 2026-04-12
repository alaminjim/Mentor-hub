import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { authRouter } from "./modules/auth/auth.route";
import { tutorRouter } from "./modules/tutor/tutor.route";
import { reviewRouter } from "./modules/review/review.route";
import { studentRouter } from "./modules/students/student.route";
import { categoryRouter } from "./modules/categories/categories.route";
import { bookingsRouter } from "./modules/bookings/bookings.route";
import { pricingRouter } from "./modules/pricing/pricing.route";
import { blogRouter } from "./modules/blog/blog.route";
import { bookmarkRouter } from "./modules/bookmark/bookmark.route";
import { statsRouter } from "./modules/stats/stats.route";
import { contactRouter } from "./modules/contact/contact.route";
import { aiRouter } from "./modules/ai/ai.route";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { notFound } from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import session from "express-session";

const app = express();

// MANUAL CORS FAILSAFE - MUST BE AT THE VERY TOP
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Stripe webhook needs raw body
import { PricingController } from "./modules/pricing/pricing.controller";
app.post("/api/pricing/webhook", express.raw({ type: "application/json" }), PricingController.stripeWebhook);

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);

app.use("/api/tutor", tutorRouter);

app.use("/api/review", reviewRouter);

app.use("/api/student", studentRouter);

app.use("/api/category", categoryRouter);

app.use("/api/booking", bookingsRouter);

app.use("/api/blog", blogRouter);

app.use("/api/bookmark", bookmarkRouter);

app.use("/api/pricing", pricingRouter);

app.use("/api/stats", statsRouter);

app.use("/api/contact", contactRouter);

app.use("/api/ai", aiRouter);
app.use("/api/dashboard", dashboardRoutes);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send({ message: "SkillBridge API Running" });
});

app.use(notFound);

app.use(errorHandler);

export default app;
