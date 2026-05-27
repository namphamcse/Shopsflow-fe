import './Header.css'

function Header() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="index.html" className="nav-logo">
          <svg className="mark" viewBox="0 0 26 26" fill="none">
            <rect x="0.5" y="0.5" width="25" height="25" rx="6" fill="#0F0F0F" />
            <path
              d="M9 9 H16 A2 2 0 0 1 18 11 V11 A2 2 0 0 1 16 13 H10 A2 2 0 0 0 8 15 V15 A2 2 0 0 0 10 17 H17"
              stroke="#FF4D1F"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="17" cy="17" r="1.2" fill="#FF4D1F" />
          </svg>
          shopsflow
        </a>

        <nav className="nav-links">
          <a href="index.html" className="nav-link active">
            Shop
          </a>
          <a href="catalog.html" className="nav-link">
            Catalog
          </a>
          <a href="orders.html" className="nav-link">
            Orders
          </a>
          <a href="#" className="nav-link">
            Support
          </a>
        </nav>

        <div className="nav-right">
          <div className="nav-search">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M9.5 9.5L12.5 12.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <input placeholder="Search products, SKUs..." />
            <span className="mono-sm" style={{ color: 'var(--ink-4)' }}>
              ⌘K
            </span>
          </div>

          <a href="cart.html" className="nav-icon-btn" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 4h2l1.5 8.5h7.5l1.5-6H6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="15" r="1" fill="currentColor" />
              <circle cx="13" cy="15" r="1" fill="currentColor" />
            </svg>
            <span className="badge">3</span>
          </a>

          <div className="acct-menu" tabIndex={0}>
            <button className="nav-avatar" aria-label="Account menu">
              MN
            </button>

            <div className="acct-menu-pop">
              <div className="acct-menu-head">
                <span className="av">MN</span>
                <div>
                  <div className="who">Mai Nguyen</div>
                  <div className="email">mai@studio.com</div>
                </div>
              </div>

              <a href="orders.html">
                <span className="icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 4h2l1 7h7l1-5H5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Your orders
              </a>

              <a href="#">
                <span className="icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M4 2.5h6l.5 8L7 9l-3.5 1.5z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Wishlist
              </a>

              <a href="#">
                <span className="icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="5" r="2" stroke="currentColor" strokeWidth="1.3" />
                    <path
                      d="M2.5 12c0-2.2 2-3.5 4.5-3.5s4.5 1.3 4.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                Account settings
              </a>

              <hr />

              <a href="login.html" className="signout">
                <span className="icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M6 11H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3M8 5l2 2-2 2M10 7H6"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
