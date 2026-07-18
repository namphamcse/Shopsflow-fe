import { Link } from "react-router-dom";
import { Logo } from "./common/Logo";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Considered electronics for focused work, quiet listening and better everyday rituals.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <Link to="/catalog">All products</Link>
          <Link to="/catalog?sort=createdAt,desc">New arrivals</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div>
          <h3>Account</h3>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Create account</Link>
          <Link to="/orders">Orders</Link>
        </div>
        <div>
          <h3>Studio</h3>
          <a href="mailto:hello@shopsflow.local">Contact</a>
          <span>Saigon, Vietnam</span>
          <span>Open source storefront</span>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© 2026 Shopsflow Studio</span>
        <span>Built with React + Spring Boot</span>
      </div>
    </footer>
  );
}

export default Footer;
