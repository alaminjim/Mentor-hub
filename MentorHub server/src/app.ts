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
import { notFound } from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import session from "express-session";

const app = express();
app.use(express.json());

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
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

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send({ message: "SkillBridge API Running" });
});

app.use(notFound);

app.use(errorHandler);

export default app;
