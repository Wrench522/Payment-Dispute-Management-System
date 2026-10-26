import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
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
          <span className="login-badge">PAYMENT DISPUTE MANAGEMENT</span>
          <h1>Resolve disputes.<br />Build trust.</h1>
          <p>
            Manage payment disputes, track investigations, and
            monitor resolutions from one secure workspace.
          </p>
        </div>

        <p className="login-copyright">
          © {new Date().getFullYear()} PayResolve
        </p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-container">
          <div className="login-mobile-brand">
            <div className="brand-icon">PD</div>
            <div>
              <h2>PayResolve</h2>
              <span>Dispute Management</span>
            </div>
          </div>

          <div className="login-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h1>Sign in to your account</h1>
            <p>Enter your credentials to access your workspace.</p>
          </div>

          {error && (
            <div className="alert error-alert" role="alert">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              className="login-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="login-security-note">
            Your dispute management workspace
          </p>
        </div>
      </section>
    </main>
  );
}