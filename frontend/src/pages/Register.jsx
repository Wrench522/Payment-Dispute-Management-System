
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(fullName.trim(), email.trim().toLowerCase(), password);
      setSuccess("Account created successfully. Redirecting to sign in...");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { email: email.trim().toLowerCase() },
        });
      }, 1200);
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand">
          <div className="brand-icon">PD</div>
          <div>
            <h2>PayResolve</h2>
            <span>Dispute Management</span>
          </div>
        </div>

        <div className="login-brand-content">
          <span className="login-badge">
            PAYMENT DISPUTE MANAGEMENT
          </span>
          <h1>Every dispute.<br />A clear resolution.</h1>
          <p>
            Take control of your payment disputes with one secure
            workspace to submit cases, follow progress, and track outcomes.
          </p>

          <div className="register-benefits">
            <div className="register-benefit">
              <span>✓</span>
              <p>Submit payment disputes online</p>
            </div>
            <div className="register-benefit">
              <span>✓</span>
              <p>Track the status of your cases</p>
            </div>
            <div className="register-benefit">
              <span>✓</span>
              <p>Keep your dispute information organized</p>
            </div>
          </div>
        </div>

        <p className="login-copyright">
          © {new Date().getFullYear()} PayResolve
        </p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-container register-form-container">
          <div className="login-mobile-brand">
            <div className="brand-icon">PD</div>
            <span>PayResolve</span>
          </div>

          <div className="login-heading">
            <span className="eyebrow">CREATE YOUR ACCOUNT</span>
            <h1>Join PayResolve</h1>
            <p>Enter your details to get started.</p>
          </div>

          {error && (
            <div className="alert error-alert" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert" role="status">
              {success}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Wrench Taiku"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="register-password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>
              <input
                id="register-confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>

            <button
              className="login-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create customer account"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="login-security-note">
            Already registered? <Link to="/login">Sign in</Link>
          </p>

          <p className="register-account-note">
            <span aria-hidden="true">🔒</span> Your account is for customer
            access. Administrator access is assigned separately.
          </p>
        </div>
      </section>
    </main>
  );
}
