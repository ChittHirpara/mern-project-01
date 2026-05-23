// url.routes.js — Defines all the API routes for this app
// A route connects a URL path + HTTP method → to a controller function
// The controller contains the actual logic

import express from 'express';
import { shortenUrl, redirectUrl, getAllUrls, deleteUrl } from '../controllers/url.controller.js';

const router = express.Router();

// POST /api/shorten   — take a long URL, return a short one
router.post('/api/shorten', shortenUrl);

// GET  /api/urls      — return all shortened URLs with their click counts
router.get('/api/urls', getAllUrls);

// DELETE /api/urls/:id — delete one URL by its MongoDB _id
router.delete('/api/urls/:id', deleteUrl);

// GET /:shortCode     — redirect to the original URL and count the click
// ⚠️  This MUST be last — if it was first, it would match "/api/shorten" as a shortCode
router.get('/:shortCode', redirectUrl);

export default router;
