import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import spotifyRoutes from "./routes/spotifyRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/spotify", spotifyRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
