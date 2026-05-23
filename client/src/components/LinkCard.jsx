// LinkCard.jsx — Displays one shortened URL as a card
// Receives a `url` object (from MongoDB) and an `onDelete` callback
// Each card shows: short URL, original URL, click count, date, Copy button, Delete button

import { useState } from 'react';

export default function LinkCard({ url, onDelete }) {
  const [copied, setCopied]   = useState(false); // tracks Copy button state
  const [deleting, setDeleting] = useState(false); // prevents double-click on Delete

  // Build the full short URL using the shortCode stored in MongoDB
  const shortUrl = `http://localhost:5000/${url.shortCode}`;

  // Copy short URL to clipboard
  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
  }

  // Delete this URL from the database
  async function handleDelete() {
    // Ask user to confirm before deleting
    const confirmed = window.confirm('Delete this short link? This cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);

    try {
      // Call backend DELETE /api/urls/:id
      const response = await fetch(`/api/urls/${url._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Tell Dashboard to remove this card from the list
      onDelete(url._id);

    } catch (err) {
      alert('Failed to delete. Please try again.');
      setDeleting(false);
    }
  }

  // Format the date nicely, e.g. "May 23, 2026"
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="link-card" id={`link-card-${url._id}`}>

      {/* Top section — short URL and original URL */}
      <div className="card-top">
        <div className="card-urls">
          {/* Short URL — clicking it opens the redirect in a new tab */}
          <div className="card-short">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}>
              🔗 localhost/{url.shortCode}
            </a>
          </div>

          {/* Original URL — truncated with CSS if too long */}
          <div className="card-original" title={url.originalUrl}>
            {url.originalUrl}
          </div>
        </div>
      </div>

      {/* Bottom section — click count, date, action buttons */}
      <div className="card-bottom">
        <div className="card-meta">
          {/* Click count badge */}
          <span className="click-badge">
            📈 {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
          </span>

          {/* Creation date */}
          <span className="date-text">{formatDate(url.createdAt)}</span>
        </div>

        <div className="card-actions">
          {/* Copy button */}
          <button
            id={`copy-btn-${url._id}`}
            className={`btn-card-copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>

          {/* Delete button */}
          <button
            id={`delete-btn-${url._id}`}
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? '⏳ Deleting…' : '🗑️ Delete'}
          </button>
        </div>
      </div>

    </div>
  );
}
