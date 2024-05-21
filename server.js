import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Wellcome to best chat app");
});

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("Connected to MongoDB :)");
    app.listen(PORT, () => console.log(`Server running on port ${PORT} :)`));
  })
  .catch((err) => {
    console.log("Error connectiong to MongoDB: ", err.message);
  });
