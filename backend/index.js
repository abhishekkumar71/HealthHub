const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();
const db_url = process.env.MONGO_URL;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userRoutes = require("./src/routes/userRouter");
const uploadRoutes = require("./src/middlewares/upload");
const sessionRoutes = require("./src/routes/sessionRouter");
app.use(
  cors({
    origin: ["http://localhost:5173", "https://healthhub-ud5p.onrender.com"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", uploadRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/", userRoutes);
app.use("/", sessionRoutes);
app.listen(8080, () => {
  mongoose
    .connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

  console.log("listening to port: 8080");
});
