import { useState } from "react";
import "./Login.css";
import { login } from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type LoginErrors = {
  email?: string;
  password?: string;
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    try {
      setIsSubmitting(true);
      const data = await login({ email: email.trim(), password });
      loginUser(data.token, data.user);
      navigate("/");
    } catch {
      setErrors({
        password: "Invalid email or password.",
      });
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <title>Sign in - Shopsflow</title>
      <div className="auth-page">
        <section className="auth-form-panel">
          <div className="auth-top">
            <a href="index.html" className="nav-logo">
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
            </a>

            <Link
              to="/register"
              className="mono-sm muted"
              style={{
                border: "1px solid var(--line)",
                padding: "8px 14px",
                borderRadius: "999px",
                color: "var(--ink)",
              }}
            >
              Create account →
            </Link>
          </div>

          <div className="auth-form-box">
            <div className="eyebrow mb-3">§ Welcome back</div>
            <h1>
              Sign in to <em>your</em>
              <br />
              studio.
            </h1>
            <p className="sub">
              Use your email and password. We never share - and we'll never
              email you marketing.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field">
                <div className="field-row">
                  <label className="field-label">Email</label>
                </div>
                <input
                  id="email"
                  name="email"
                  className="input"
                  type="email"
                  placeholder="you@studio.com"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="field">
                <div className="field-row">
                  <label className="field-label">Password</label>
                  <a href="#" className="forgot">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="field-error">{errors.password}</p>
                )}
              </div>

              <label className="check mt-2" htmlFor="rememberMe">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  defaultChecked
                />
                <span className="box">✓</span>
                <span>Remember me</span>
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Signing in
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
                    Sign in
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

              <div className="divider-or">
                <hr />
                <span>or continue with</span>
                <hr />
              </div>

              <div className="sso-row">
                <button type="button" className="sso-btn">
                  <svg viewBox="0 0 18 18" fill="none">
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
                  Continue with Google
                </button>
              </div>
            </form>

            <p className="auth-foot">
              New around here? <Link to="/register">Create an account →</Link>
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
              &nbsp;·&nbsp;
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
      </div>
    </>
  );
}

export default Login;
