import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { API_BASE } from "../config/api";
import "../styles/login.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo(null);
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }
      if (data.devResetLink) {
        try {
          const url = new URL(data.devResetLink, window.location.origin);
          const token = url.searchParams.get("token");
          if (token) {
            navigate(`/reset-password?token=${encodeURIComponent(token)}`);
            return;
          }
        } catch (ignored) {
          // Fall back to showing the link if URL parsing fails.
        }
      }
      setInfo(data);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <TopBar />

      <header className="login-page-header">
        <Link to="/login" className="login-back-link">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          Back to log in
        </Link>
        <div className="login-logo-center">
          <Link to="/" className="login-logo-text">
            Hotel
          </Link>
        </div>
        <div className="login-header-spacer" aria-hidden />
      </header>

      <main className="login-main">
        <div className="login-card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="login-form-section" style={{ width: "100%" }}>
            <header className="login-form-intro">
              <h2>Reset password</h2>
              <h1>Forgot your password?</h1>
            </header>

            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 15,
                marginBottom: "1.25rem",
                color: "#333",
              }}
            >
              Enter the email you used to register. If we find an account, you
              can set a new password from the link we provide.
            </p>

            <form className="login-form" onSubmit={submit}>
              <div className="login-field">
                <label htmlFor="fp-email" className="sr-only">
                  Email
                </label>
                <input
                  className="login-input"
                  id="fp-email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <p style={{ color: "red", fontSize: 14, marginBottom: 8 }}>
                  {error}
                </p>
              )}

              {info && (
                <div
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 14,
                    marginBottom: 12,
                    color: "#1a1a1a",
                  }}
                >
                  <p>{info.message}</p>
                  {info.devResetLink && (
                    <p style={{ marginTop: 12 }}>
                      <strong>Local dev:</strong> no email is sent in this
                      environment.{" "}
                      <a
                        href={info.devResetLink}
                        style={{ wordBreak: "break-all", color: "#4c0b1a" }}
                      >
                        Open password reset page
                      </a>
                    </p>
                  )}
                </div>
              )}

              <div className="login-actions">
                <button
                  className="login-btn-primary"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? "Sending…" : "Send reset instructions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
