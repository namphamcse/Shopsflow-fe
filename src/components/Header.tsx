import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { initials } from "../utils/format";
import { Logo } from "./common/Logo";
import "./Header.css";

function Header() {
  const { user, isLoggedIn, logoutUser } = useAuth();
  const { cart } = useCart();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = query.trim();
    navigate(keyword ? `/catalog?keyword=${encodeURIComponent(keyword)}` : "/catalog");
    setMobileOpen(false);
  }

  function handleLogout() {
    logoutUser();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Logo />

        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div className={`header-content ${mobileOpen ? "is-open" : ""}`}>
          <nav className="primary-nav" aria-label="Primary navigation">
            <NavLink to="/" end onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/catalog" onClick={() => setMobileOpen(false)}>
              Catalog
            </NavLink>
            {isLoggedIn && (
              <NavLink to="/orders" onClick={() => setMobileOpen(false)}>
                Orders
              </NavLink>
            )}
            {user?.role === "ADMIN" && (
              <NavLink to="/admin" onClick={() => setMobileOpen(false)}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            <form className="header-search" onSubmit={handleSearch} role="search">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the catalog"
                aria-label="Search products"
              />
            </form>

            <Link className="header-icon-button" to="/cart" aria-label="Shopping cart">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2.5 3.5H5L6.4 13H15.5L17 6H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="7.5" cy="16.5" r="1" fill="currentColor" />
                <circle cx="14.5" cy="16.5" r="1" fill="currentColor" />
              </svg>
              {cart.totalItems > 0 && <span className="cart-count">{cart.totalItems}</span>}
            </Link>

            {isLoggedIn && user ? (
              <div className="account-dropdown" ref={menuRef}>
                <button
                  className="account-trigger"
                  type="button"
                  aria-label="Open account menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  {initials(user.name) || "U"}
                </button>
                {menuOpen && (
                  <div className="account-popover">
                    <div className="account-summary">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <small>{user.role}</small>
                    </div>
                    <Link to="/orders" onClick={() => setMenuOpen(false)}>
                      My orders
                    </Link>
                    <Link to="/cart" onClick={() => setMenuOpen(false)}>
                      Shopping cart
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}>
                        Admin workspace
                      </Link>
                    )}
                    <button type="button" onClick={handleLogout}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="sign-in-link" to="/login" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
