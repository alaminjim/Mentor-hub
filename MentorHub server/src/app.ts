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

// Stripe webhook needs raw body, so we put it BEFORE express.json()
import { PricingController } from "./modules/pricing/pricing.controller";
app.post("/api/pricing/webhook", express.raw({ type: "application/json" }), PricingController.stripeWebhook);

app.use(express.json());

// Configure CORS to allow both production and Vercel preview deployments
app.use(
  cors({
    origin: true, // Mirror the request origin (Dynamic CORS)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
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
