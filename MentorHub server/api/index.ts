import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "MentorHub API Running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
