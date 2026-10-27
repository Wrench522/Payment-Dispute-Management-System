
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

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
      await register(fullName, email, password);
      setSuccess("Account created successfully. You can now sign in.");

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
          <h1>Start resolving.<br />Build trust.</h1>
          <p>
            Create your account to manage payment disputes,
            track investigations, and monitor resolutions.
          </p>
        </div>

        <p className="login-copyright">
          © {new Date().getFullYear()} PayResolve
        </p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-container">
          <div className="login-heading">
            <span className="eyebrow">GET STARTED</span>
            <h1>Create your account</h1>
            <p>Enter your details to join PayResolve.</p>
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
                placeholder="Your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
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
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
            </div>

            <button
              className="login-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="login-security-note">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
