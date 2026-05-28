import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  return (
    <>
      <title>Create account - Shopsflow</title>
      <div className="auth-page register-page">
        <section className="auth-form-panel">
          <div className="auth-top">
            <Link to="/" className="nav-logo">
              <svg className="mark" viewBox="0 0 26 26" fill="none">
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
            </Link>
            <Link
              to="/login"
              className="mono-sm muted"
              style={{
                border: "1px solid var(--line)",
                padding: "8px 14px",
                borderRadius: "999px",
                color: "var(--ink)",
              }}
            >
              Sign in -&gt;
            </Link>
          </div>

          <div className="auth-form-box">
            <div className="eyebrow mb-3">Create account</div>
            <h1>
              Make a <em>home</em>
              <br />
              for the <span className="signal">gear</span> you love.
            </h1>
            <p className="sub">
              Track orders, save your wishlist, and get the occasional studio
              drop before they go public.
            </p>

            <form className="auth-form">
              <div className="row-2">
                <div className="field">
                  <label className="field-label" htmlFor="firstName">
                    First name
                  </label>
                  <input id="firstName" className="input" placeholder="Mai" />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="lastName">
                    Last name
                  </label>
                  <input id="lastName" className="input" placeholder="Nguyen" />
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="you@studio.com"
                />
                <span className="field-help">We'll send a confirmation link.</span>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="Choose something memorable"
                />
                <div className="checklist">
                  <span className="row met">
                    <span className="dot"></span>
                    <span>At least 8 characters</span>
                  </span>
                </div>
              </div>

              <label className="check">
                <input type="checkbox" defaultChecked />
                <span className="box">✓</span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--ink-3)",
                    lineHeight: 1.5,
                  }}
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    style={{
                      color: "var(--ink)",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    style={{
                      color: "var(--ink)",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <button type="submit" className="btn btn-primary btn-lg btn-block mt-3">
                Create my account
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="divider-or">
                <hr />
                <span>or sign up with</span>
                <hr />
              </div>

              <div className="sso-row">
                <button type="button" className="sso-btn">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M17.64 9.20454C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
                      fill="#34A853"
                    />
                    <path
                      d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
              </div>
            </form>

            <p className="auth-foot">
              Already with us? <Link to="/login">Sign in -&gt;</Link>
            </p>
          </div>

          <div className="legal">
            <span>© 2026 Shopsflow Studio</span>
            <span>
              <a
                href="#"
                style={{
                  color: "var(--ink-3)",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                Privacy
              </a>
              &nbsp;-&nbsp;
              <a
                href="#"
                style={{
                  color: "var(--ink-3)",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                Terms
              </a>
            </span>
          </div>
        </section>

        <aside className="auth-art-panel">
          <div className="auth-art-top">
            <span className="mono-sm">MEMBERSHIP / PERKS</span>
            <span className="mono-sm">
              <span className="ind">●</span> FREE FOREVER
            </span>
          </div>

          <div className="benefits">
            <div className="benefit-block">
              <div className="n">01</div>
              <div>
                <h3>
                  Track your <em>shipments</em>
                  <br />
                  in real time.
                </h3>
                <p>
                  Every order shows live carrier tracking, signed delivery, and
                  a clean PDF invoice the moment it ships.
                </p>
              </div>
            </div>
            <div className="benefit-block">
              <div className="n">02</div>
              <div>
                <h3>
                  Wishlist <em>once,</em>
                  <br />
                  buy when ready.
                </h3>
                <p>
                  Save anything for later. We'll quietly let you know when a
                  wishlisted item drops in price or comes back in stock.
                </p>
              </div>
            </div>
            <div className="benefit-block">
              <div className="n">03</div>
              <div>
                <h3>
                  First look at <em>studio drops.</em>
                </h3>
                <p>
                  Limited-run items from our partner studios go to members 24
                  hours before they hit the public catalog.
                </p>
              </div>
            </div>
          </div>

          <div className="art-foot">
            <div className="stat">
              <div className="n">14</div>
              <div className="l">Partner studios</div>
            </div>
            <div className="stat">
              <div className="n">8 200+</div>
              <div className="l">Members worldwide</div>
            </div>
            <div className="stat">
              <div className="n">96 %</div>
              <div className="l">Reorder satisfaction</div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Register;
