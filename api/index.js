// api/index.js - Vercel serverless entry point

const express = require("express");
const app = express();
const morgan = require("morgan");
var fs = require("fs");
const helmet = require("helmet");
var path = require("path");
const cors = require("cors");
const ItemRouter = require("../routes/itemRoute.route");
const connection = require("../connection");
const loggingMiddleware = require("../middlewares/loggingMiddleware.middleware");
const errorMiddleware = require("../middlewares/errorMiddleware.middleware");
const DeliveryVehicleRouter = require("../routes/deliveryVehicleRoutes.route");
const userRouter = require("../routes/userRoute.route");
const OrderRouter = require("../routes/orderRoutes.route");
const CustomerRouter = require("../routes/customerRoutes.route");
const authenticateToken = require("../middlewares/authMiddleware.middleware");
require("dotenv").config();

// CORS configuration - allow Vercel deployment URLs
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  process.env.FRONTEND_URL || "",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow localhost for development
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // Allow any Vercel deployment domain
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }
      
      // Allow custom frontend URL if configured
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      
      // In production, be more strict; in development, allow all
      if (process.env.NODE_ENV === "production" && !origin.includes("vercel.app")) {
        console.warn(`CORS blocked origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
      
      // Allow in development
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// helmet for security purpose
app.use(helmet());

// Morgan logging - only write to file if not in serverless environment
if (process.env.VERCEL_ENV !== "production") {
  app.use(
    morgan(loggingMiddleware, {
      stream: fs.createWriteStream(path.join(__dirname, "../access.log"), {
        flags: "a",
      }),
    })
  );
} else {
  app.use(morgan("combined"));
}

// Initialize MongoDB connection
connection
  .then(() => {
    console.log("Backend connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message);
    console.log("Backend not connected to MongoDB");
  });

// Health check route for Vercel
app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Public routes (no authentication required)
app.use("/api", userRouter);
app.use("/api", ItemRouter);

// Protected routes (authentication required)
app.use(authenticateToken);
app.use("/api", DeliveryVehicleRouter);
app.use("/api", OrderRouter);
app.use("/api", CustomerRouter);

// Use the error middleware after all routes
app.use(errorMiddleware);

// Export the app for Vercel serverless functions
module.exports = app;
