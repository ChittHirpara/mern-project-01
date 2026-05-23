// Url.model.js — MongoDB Schema (the shape of data we store)
// Mongoose lets us define what fields a document must have,
// their types, and default values — just like a table schema in SQL

import mongoose from 'mongoose';

// Define the schema — this is the blueprint for every URL document
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,           // must be a string
    required: true,         // cannot be empty
  },
  shortCode: {
    type: String,           // the 7-character random code, e.g. "abc1234"
    required: true,
    unique: true,           // no two documents can have the same shortCode
  },
  clicks: {
    type: Number,
    default: 0,             // every new URL starts with 0 clicks
  },
  createdAt: {
    type: Date,
    default: Date.now,      // automatically set to current date/time
  },
});

// Create the Model — Mongoose will store documents in the "urls" collection in MongoDB
const Url = mongoose.model('Url', urlSchema);

export default Url;
