// Dashboard.jsx — Shows all shortened URLs as cards
// Responsibilities:
//   1. Fetch all URLs from backend GET /api/urls when the component loads
//   2. Re-fetch whenever refreshKey changes (passed from App.jsx)
//   3. Show a loading spinner, an error, or the list of link cards

import { useState, useEffect } from 'react';
import LinkCard from './LinkCard';

// refreshKey is a number that changes every time a new URL is shortened
// When it changes, useEffect runs again → fetches the updated list from server
export default function Dashboard({ refreshKey }) {
  const [urls, setUrls]       = useState([]); // list of URL objects from MongoDB
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // useEffect runs after every render where refreshKey has changed
  useEffect(() => {
    fetchUrls();
  }, [refreshKey]); // dependency array — re-run when refreshKey changes

  // Fetch all shortened URLs from the backend
  async function fetchUrls() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/urls');

      if (!response.ok) {
        throw new Error('Failed to load URLs');
      }

      const data = await response.json();
      setUrls(data.data); // data.data is the array of URL documents

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Called by LinkCard after a URL is deleted
  // Instead of re-fetching from server, we just remove it from local state
  function handleDelete(deletedId) {
    setUrls(urls.filter((url) => url._id !== deletedId));
  }

  // Calculate total clicks across all URLs (for the stats badge)
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  return (
    <section className="dashboard">

      {/* Header row with title and stats */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">📊 Your Links</h2>

        {/* Only show stats when there are URLs */}
        {!loading && urls.length > 0 && (
          <div className="stats-chips">
            <div className="stat-chip total">🔗 {urls.length} {urls.length === 1 ? 'link' : 'links'}</div>
            <div className="stat-chip clicks">📈 {totalClicks} total clicks</div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="feedback-msg error">
          ⚠️ {error} — Make sure the backend server is running on port 5000.
        </div>
      )}

      {/* Empty state — no URLs yet */}
      {!loading && !error && urls.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
          <div className="empty-title">No links yet</div>
          <div className="empty-sub">Shorten your first URL above to get started!</div>
        </div>
      )}

      {/* URL cards grid */}
      {!loading && !error && urls.length > 0 && (
        <div className="links-grid">
          {urls.map((url) => (
            // key prop is required by React when rendering a list — must be unique
            <LinkCard key={url._id} url={url} onDelete={handleDelete} />
          ))}
        </div>
      )}

    </section>
  );
}
