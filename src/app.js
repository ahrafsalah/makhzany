import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import itemsRouter from "./routes/items.routes.js";
import movesRouter from "./routes/moves.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import reportsRouter from "./routes/reports.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*" || !process.env.CORS_ORIGIN
        ? true
        : process.env.CORS_ORIGIN.split(",")
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// التأكد من الاتصال بقاعدة البيانات قبل أي طلب API
app.use(async (req, res, next) => {
  try {
    await connectDB(process.env.MONGODB_URI);
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/items", itemsRouter);
app.use("/api/moves", movesRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/reports", reportsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;