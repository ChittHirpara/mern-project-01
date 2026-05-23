// url.controller.js — Business logic for every API route
// Each function here handles one specific job.
// They all follow the same pattern: try → do DB work → send response → catch error

import { nanoid } from 'nanoid';
import Url from '../models/Url.model.js';

// ─────────────────────────────────────────────
// POST /api/shorten
// Takes a long URL from req.body, generates a short code, saves to MongoDB
// ─────────────────────────────────────────────
export async function shortenUrl(req, res) {
  try {
    // Get the long URL from the request body
    const { originalUrl } = req.body;

    // Validate — return early if empty
    if (!originalUrl) {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    // Validate URL format using the built-in URL constructor
    // If the URL is invalid (e.g. "hello world"), it throws an error
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL. Please include http:// or https://' });
    }

    // Check if this exact URL was already shortened before
    // If yes, return the existing short code instead of creating a duplicate
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.status(200).json({
        message: 'URL already shortened',
        shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
      });
    }

    // Generate a random 7-character code, e.g. "abc1234"
    const shortCode = nanoid(7);

    // Save the new document to MongoDB
    await Url.create({ originalUrl, shortCode });

    // Send back the full short URL
    return res.status(201).json({
      message: 'URL shortened successfully',
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    });

  } catch (error) {
    console.error('shortenUrl error:', error);
    return res.status(500).json({ error: 'Server error while shortening URL' });
  }
}

// ─────────────────────────────────────────────
// GET /:shortCode
// Looks up the shortCode in MongoDB, increments clicks, then redirects
// ─────────────────────────────────────────────
export async function redirectUrl(req, res) {
  try {
    // Get the short code from the URL, e.g. visiting /abc1234 gives shortCode = "abc1234"
    const { shortCode } = req.params;

    // Find the matching document in MongoDB
    const urlDoc = await Url.findOne({ shortCode });

    // If no document found, the short code is invalid
    if (!urlDoc) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Increment the click counter and save
    urlDoc.clicks = urlDoc.clicks + 1;
    await urlDoc.save();

    // Redirect the user to the original long URL
    return res.redirect(urlDoc.originalUrl);

  } catch (error) {
    console.error('redirectUrl error:', error);
    return res.status(500).json({ error: 'Server error during redirect' });
  }
}

// ─────────────────────────────────────────────
// GET /api/urls
// Returns all shortened URLs sorted by newest first
// ─────────────────────────────────────────────
export async function getAllUrls(req, res) {
  try {
    // find() with no filter returns ALL documents
    // sort({ createdAt: -1 }) means newest first (-1 = descending)
    const urls = await Url.find().sort({ createdAt: -1 });

    return res.status(200).json({ count: urls.length, data: urls });

  } catch (error) {
    console.error('getAllUrls error:', error);
    return res.status(500).json({ error: 'Server error while fetching URLs' });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/urls/:id
// Deletes one URL document by its MongoDB _id
// ─────────────────────────────────────────────
export async function deleteUrl(req, res) {
  try {
    // Get the MongoDB _id from the URL parameter
    const { id } = req.params;

    // findByIdAndDelete finds the document by _id and removes it in one step
    const deleted = await Url.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'URL not found' });
    }

    return res.status(200).json({ message: 'URL deleted successfully' });

  } catch (error) {
    console.error('deleteUrl error:', error);
    return res.status(500).json({ error: 'Server error while deleting URL' });
  }
}
