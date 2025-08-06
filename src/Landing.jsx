import React, { useState } from "react";

export default function Landing({ onShowLogin, onShowSignup }) {
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🔐</div>
            <span className="logo-text">PasswordLock</span>
          </div>
          <nav className="nav-menu">
            <button
              onClick={() => scrollToSection("home")}
              className={`nav-link ${activeSection === "home" ? "active" : ""}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`nav-link ${
                activeSection === "about" ? "active" : ""
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className={`nav-link ${
                activeSection === "features" ? "active" : ""
              }`}
            >
              Features
            </button>
          </nav>
          <div className="auth-buttons">
            <button onClick={onShowLogin} className="nav-login-btn">
              Login
            </button>
            <button onClick={onShowSignup} className="nav-signup-btn">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Home Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="new-badge">New</div>
          <h1 className="hero-title">
            Secure Password Management for Modern Life
          </h1>
          <p className="hero-subtitle">
            PasswordLock brings military-grade encryption to your fingertips &
            keeps your digital life secure.
          </p>
          <div className="hero-buttons">
            <button onClick={onShowSignup} className="hero-primary-btn">
              Get Started
              <span className="arrow">→</span>
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hero-secondary-btn"
            >
              View Features
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="content-section">
        <div className="section-content">
          <h2 className="section-title">About PasswordLock</h2>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">🔐</div>
              <h3>Military-Grade Security</h3>
              <p>
                Your passwords are encrypted using AES-256 encryption, the same
                standard used by banks and governments worldwide.
              </p>
            </div>
            <div className="about-card">
              <div className="about-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>
                Access your passwords instantly with our optimized cloud
                infrastructure and local caching system.
              </p>
            </div>
            <div className="about-card">
              <div className="about-icon">🌐</div>
              <h3>Cross-Platform</h3>
              <p>
                Access your vault from anywhere - desktop, tablet, or mobile.
                Your data syncs seamlessly across all devices.
              </p>
            </div>
            <div className="about-card">
              <div className="about-icon">🛡️</div>
              <h3>Zero-Knowledge</h3>
              <p>
                We can't see your passwords. All encryption and decryption
                happens locally on your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="content-section">
        <div className="section-content">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔑</div>
              <h3>Password Generator</h3>
              <p>
                Generate strong, unique passwords with customizable length and
                character sets.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>One-Click Copy</h3>
              <p>
                Copy usernames and passwords with a single click. No more typing
                or memorizing.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👁️</div>
              <h3>Password Visibility</h3>
              <p>
                Toggle password visibility with the eye icon. Keep your
                passwords hidden when needed.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>
                Quickly find any password with our intelligent search and
                filtering system.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Responsive</h3>
              <p>
                Perfect experience on all devices - desktop, tablet, and mobile
                phones.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Auto-Sync</h3>
              <p>
                Your passwords automatically sync across all your devices in
                real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <p className="trust-text">Trusted by users worldwide</p>
        <div className="trust-logos">
          <div className="trust-logo">
            <div className="logo-icon-small">🛡️</div>
            <span>SecureTech</span>
          </div>
          <div className="trust-logo">
            <div className="logo-icon-small">🔒</div>
            <span>CyberSafe</span>
          </div>
          <div className="trust-logo">
            <div className="logo-icon-small">⚡</div>
            <span>FastLock</span>
          </div>
          <div className="trust-logo">
            <div className="logo-icon-small">💎</div>
            <span>VaultPro</span>
          </div>
        </div>
      </section>
    </div>
  );
}
