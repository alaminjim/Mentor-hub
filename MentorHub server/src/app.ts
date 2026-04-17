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
import { pricingRouter } from "./modules/pricing/pricing.route.js";
import { blogRouter } from "./modules/blog/blog.route.js";
import { bookmarkRouter } from "./modules/bookmark/bookmark.route.js";
import { statsRouter } from "./modules/stats/stats.route.js";
import { contactRouter } from "./modules/contact/contact.route.js";
import { aiRouter } from "./modules/ai/ai.route.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { notFound } from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import session from "express-session";

const app = express();
app.set("trust proxy", true);

// Stripe webhook needs raw body

import { PricingController } from "./modules/pricing/pricing.controller.js";
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
