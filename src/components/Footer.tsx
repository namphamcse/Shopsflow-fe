function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <a
            href="index.html"
            className="nav-logo"
            style={{ fontSize: "22px" }}
          >
            <svg
              className="mark"
              viewBox="0 0 26 26"
              fill="none"
              style={{ width: "30px", height: "30px" }}
            >
              <rect
                x="0.5"
                y="0.5"
                width="25"
                height="25"
                rx="6"
                fill="#0F0F0F"
              />
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

          <p
            className="mt-4"
            style={{
              maxWidth: "32ch",
              color: "var(--ink-3)",
              fontSize: "13px",
            }}
          >
            A small catalogue of considered electronics, run out of a studio in
            Saigon. Established 2024.
          </p>
        </div>

        <div>
          <h6>Shop</h6>
          <a href="catalog.html">All products</a>
          <a href="catalog.html">New this week</a>
          <a href="catalog.html">Sale</a>
          <a href="catalog.html">Gift cards</a>
        </div>

        <div>
          <h6>Account</h6>
          <a href="login.html">Sign in</a>
          <a href="register.html">Create account</a>
          <a href="orders.html">My orders</a>
          <a href="cart.html">Cart</a>
        </div>

        <div>
          <h6>Studio</h6>
          <a href="#">About</a>
          <a href="#">Standards</a>
          <a href="#">Contact</a>
          <a href="#">API</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Shopsflow Studio · MIT licensed</span>
        <span>v 0.4.0 · build edd8fd38</span>
      </div>
    </footer>
  );
}

export default Footer;
