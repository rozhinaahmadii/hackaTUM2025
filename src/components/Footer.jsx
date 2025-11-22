export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">🦊</div>
          <h3>Interfox</h3>
          <p>A guided, data-driven path to home ownership.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h4>Explore</h4>
          <a href="/">Home</a>
          <a href="/dream-home">Dream Home</a>
          <a href="/profile">Profile</a>
          <a href="/planner">Planner</a>
        </div>

        {/* Contact */}
        <div className="footer-links">
          <h4>Contact</h4>
          <a>Email: support@interfox.ai</a>
          <a>Munich, Germany</a>
        </div>

        {/* Socials */}
        <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="footer-social-icons">
            <span>🌐</span>
            <span>🐦</span>
            <span>📸</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Interfox — All rights reserved.
      </div>
    </footer>
  );
}
