import express from "express";
import connectDB from "./database/db.js"; // Import the connectDB function
import userRoute from "./routes/user.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js"

dotenv.config({ path: "../.env" });


const app = express();
const PORT = 8080;

// Connect to MongoDB
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
