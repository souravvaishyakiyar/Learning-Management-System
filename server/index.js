import express from 'express';
import connectDB from './database/db.js'; // Import the connectDB function
import userRoute from './routes/user.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
const PORT = 8080;

dotenv.config();

// Connect to MongoDB
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:8080"],
    credentials: true,
}));

app.use("/api/v1/user",userRoute);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
