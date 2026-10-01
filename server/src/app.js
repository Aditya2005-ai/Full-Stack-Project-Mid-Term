/**
 * Express Application Setup
 * Architecture Boundary: Rare modification zone
 * Base URL: /api/v1 (Conforms to Problem Statement 06)
 */

import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { notFound } from './middleware/notFoundMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import buildRoutes from './routes/buildRoutes.js';
import generationRoutes from './routes/generationRoutes.js';

const app = express();

// Global Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoints (Both /api/health and /api/v1/health supported)
const healthHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running'
  });
};

app.get('/api/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// API v1 Routes (Problem Statement 06 Standard)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/modules', moduleRoutes);
app.use('/api/v1/builds', buildRoutes);
app.use('/api/v1/generation', generationRoutes);
app.use('/api/v1', generationRoutes); // For /api/v1/generate and /api/v1/download/:token

// Backward-compatible fallback for /api routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/builds', buildRoutes);
app.use('/api/generation', generationRoutes);

// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
