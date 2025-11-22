export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h4>Interfox</h4>
          <p>A guided, data-driven path to home ownership.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h4>Explore</h4>
          <a href="/dream-home">Dream Home</a>
          <a href="/planner">Planner</a>
        </div>

        {/* Contact */}
        <div className="footer-links">
          <h4>Contact</h4>
          <a>Email: support@interfox.com</a>
          <a>Munich, Germany</a>
        </div>

        {/* Socials */}
        <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="footer-social-icons">
              <img src="/github.svg" alt="GitHub" className="footer-icon" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Interfox - All rights reserved.
      </div>
    </footer>
  );
}
