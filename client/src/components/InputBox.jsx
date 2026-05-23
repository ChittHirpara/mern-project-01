// InputBox.jsx — The URL input form
// Responsibilities:
//   1. Let the user type a long URL
//   2. Send it to the backend POST /api/shorten
//   3. Show the returned short URL with a Copy button
//   4. Tell the parent (App.jsx) that shortening succeeded → so Dashboard refreshes

import { useState } from 'react';

export default function InputBox({ onShortenSuccess }) {
  // State variables
  const [longUrl, setLongUrl] = useState('');   // what the user types
  const [loading, setLoading] = useState(false); // true while waiting for server
  const [error, setError]     = useState('');    // error message to show user
  const [result, setResult]   = useState(null);  // the short URL returned by server
  const [copied, setCopied]   = useState(false); // tracks if user clicked Copy

  // Called when the form is submitted
  async function handleShorten(e) {
    e.preventDefault(); // stop page from reloading

    // Reset previous messages
    setError('');
    setResult(null);

    // Simple client-side check — don't even call server if input is empty
    if (!longUrl.trim()) {
      setError('Please enter a URL to shorten.');
      return;
    }

    setLoading(true);

    try {
      // Call our backend API
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: longUrl.trim() }),
      });

      const data = await response.json();

      // If server returned an error status, throw it
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success — store the short URL and clear the input
      setResult(data.shortUrl);
      setLongUrl('');

      // Tell App.jsx to refresh the Dashboard
      onShortenSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // always stop the loading spinner
    }
  }

  // Called when the user clicks the "Copy" button
  async function handleCopy() {
    await navigator.clipboard.writeText(result); // copy to clipboard
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset button text after 2 seconds
  }

  return (
    <div className="input-card">
      <label className="input-label" htmlFor="url-input">🔗 Paste your long URL</label>

      <form onSubmit={handleShorten}>
        <div className="input-row">
          {/* URL input field */}
          <input
            id="url-input"
            type="url"
            className="url-input"
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            autoComplete="off"
          />

          {/* Submit button */}
          <button
            id="shorten-btn"
            type="submit"
            className="btn-shorten"
            disabled={loading}
          >
            {loading ? '⏳ Shortening…' : '⚡ Shorten It!'}
          </button>
        </div>
      </form>

      {/* Show error if any */}
      {error && (
        <div className="feedback-msg error">
          ⚠️ {error}
        </div>
      )}

      {/* Show result card after successful shorten */}
      {result && (
        <div className="result-card">
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Your short link ✨
            </div>
            <div className="result-short-url">{result}</div>
          </div>

          {/* Copy button */}
          <button
            id="copy-result-btn"
            className={`btn-copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
