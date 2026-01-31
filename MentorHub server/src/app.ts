import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("API IS WORKING");
});

export default app;
