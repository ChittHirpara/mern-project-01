// index.js — Entry point for the Express server
// This file:
//   1. Loads environment variables from .env
//   2. Creates the Express app and adds middleware
//   3. Connects to MongoDB
//   4. Starts listening on PORT 5000

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/url.routes.js';

// Load .env file — reads MONGO_URI, PORT, BASE_URL into process.env
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
// cors() allows the React app on port 5173 to call this server on port 5000
// Without this the browser would block the request (CORS policy)
app.use(cors({
  origin: 'http://localhost:5173',
}));

// express.json() lets us read JSON from req.body in our controllers
app.use(express.json());

// ===== ROUTES =====
// All URL-related routes are in url.routes.js
app.use('/', urlRoutes);

// ===== CONNECT TO MONGODB AND START SERVER =====
// We only start listening after MongoDB is connected
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // stop the server if DB fails
  });
