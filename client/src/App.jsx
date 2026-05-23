// App.jsx — Root component
// This is the main component that holds everything together.
// It renders the Navbar, the InputBox, and the Dashboard.

import { useState } from 'react';
import InputBox from './components/InputBox';
import Dashboard from './components/Dashboard';
import './index.css';

export default function App() {
  // This state variable is used as a "trigger" to refresh the Dashboard
  // Every time we shorten a URL, we flip this boolean to force Dashboard to re-fetch
  const [refreshKey, setRefreshKey] = useState(0);

  // Called by InputBox after a URL is successfully shortened
  function handleShortenSuccess() {
    setRefreshKey(refreshKey + 1); // changing refreshKey causes Dashboard to re-run useEffect
  }

  return (
    <div className="app">

      {/* Animated background blobs — purely decorative */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* ===== NAVBAR ===== */}
      <header>
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="logo">
              <div className="logo-icon">⚡</div>
              <span className="logo-text">SnapLink</span>
            </div>
            <div className="nav-badge">URL Shortener</div>
          </div>
        </nav>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main">

        {/* Hero Section — heading + input box */}
        <section className="hero">
          <div className="hero-tag">✨ Free &amp; Fast</div>
          <h1 className="hero-title">
            Shorten any URL<br />
            <span>in one click</span>
          </h1>
          <p className="hero-subtitle">
            Paste any long, ugly link below and get a clean short URL instantly.
            Every visit to the short URL is tracked as a click.
          </p>

          {/* InputBox receives a callback so it can tell App when shortening is done */}
          <InputBox onShortenSuccess={handleShortenSuccess} />
        </section>

        {/* Dashboard receives refreshKey — when it changes, Dashboard re-fetches from server */}
        <Dashboard refreshKey={refreshKey} />

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        Built with <span>React + Express + MongoDB</span> &nbsp;·&nbsp; SnapLink © {new Date().getFullYear()}
      </footer>

    </div>
  );
}
