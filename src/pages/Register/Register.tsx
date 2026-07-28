import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { useState } from "react";
import { register } from "../../api/authApi";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";

type RegisterErrors = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleCreateAccount(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    
    const nextErrors: RegisterErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    }
    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (!firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }
    if (!lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
      });
      toast.success("Account created successfully.");
      navigate("/login");
    } catch (error) {
      setErrors({
        email: getApiErrorMessage(error, "Could not create this account."),
      });
    } finally {
      setIsSubmitting(false);
    }
  }
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
              Create one account to manage your cart, review products and follow
              every order you place.
            </p>

            <form className="auth-form" onSubmit={handleCreateAccount}>
              <div className="row-2">
                <div className="field">
                  <label className="field-label" htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    className="input"
                    placeholder="Mai"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                  {errors.firstName && (
                    <p className="field-error">{errors.firstName}</p>
                  )}
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    className="input"
                    placeholder="Nguyen"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                  {errors.lastName && (
                    <p className="field-error">{errors.lastName}</p>
                  )}
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <span className="field-help">
                  You'll use this email to sign in.
                </span>
                {errors.email && <p className="field-error">{errors.email}</p>}
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <div className="checklist">
                  <span className="row met">
                    <span className="dot"></span>
                    <span>At least 8 characters</span>
                  </span>
                </div>
                {errors.password && (
                  <p className="field-error">{errors.password}</p>
                )}
              </div>

              <label className="check">
                <input type="checkbox" defaultChecked required />
                <span className="box">✓</span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--ink-3)",
                    lineHeight: 1.5,
                  }}
                >
                  I agree to the{" "}
                  <span style={{ color: "var(--ink)" }}>Terms of Service</span>{" "}
                  and{" "}
                  <span style={{ color: "var(--ink)" }}>Privacy Policy</span>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Creating account
                    <svg
                      className="spin-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <circle
                        cx="7"
                        cy="7"
                        r="5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        opacity="0.25"
                      />
                      <path
                        d="M12 7a5 5 0 0 0-5-5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    Create my account
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="auth-foot">
              Already with us? <Link to="/login">Sign in -&gt;</Link>
            </p>
          </div>

          <div className="legal">
            <span>© 2026 Shopsflow Studio</span>
            <span>Privacy · Terms</span>
          </div>
        </section>

        <aside className="auth-art-panel">
          <div className="auth-art-top">
            <span className="mono-sm">ACCOUNT / FEATURES</span>
            <span className="mono-sm">
              <span className="ind">●</span> AVAILABLE NOW
            </span>
          </div>

          <div className="benefits">
            <div className="benefit-block">
              <div className="n">01</div>
              <div>
                <h3>
                  Keep your <em>orders</em>
                  <br />
                  in one place.
                </h3>
                <p>
                  Review the products, totals, dates and current status for every
                  order associated with your account.
                </p>
              </div>
            </div>
            <div className="benefit-block">
              <div className="n">02</div>
              <div>
                <h3>
                  Build your <em>cart,</em>
                  <br />
                  then order when ready.
                </h3>
                <p>
                  Add products, adjust available quantities and place an order
                  through the connected Shopsflow backend.
                </p>
              </div>
            </div>
            <div className="benefit-block">
              <div className="n">03</div>
              <div>
                <h3>
                  Share useful <em>reviews.</em>
                </h3>
                <p>
                  Publish, update or remove your own rating and product notes
                  after signing in.
                </p>
              </div>
            </div>
          </div>

          <div className="art-foot">
            <div className="stat">
              <div className="n">01</div>
              <div className="l">Secure account</div>
            </div>
            <div className="stat">
              <div className="n">02</div>
              <div className="l">Order history</div>
            </div>
            <div className="stat">
              <div className="n">03</div>
              <div className="l">Product reviews</div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Register;
