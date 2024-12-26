import express from 'express';
import connectDB from './database/db.js'; // Import the connectDB function

const app = express();
const PORT = 8080;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
