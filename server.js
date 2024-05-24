import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Wellcome to best chat app");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("Connected to MongoDB :)");
    app.listen(PORT, () => console.log(`Server running on port ${PORT} :)`));
  })
  .catch((err) => {
    console.log("Error connectiong to MongoDB: ", err.message);
  });
