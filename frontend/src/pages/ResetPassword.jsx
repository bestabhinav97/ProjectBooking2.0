import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import { API_BASE } from "../config/api";
import "../styles/login.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = (searchParams.get("token") || "").trim();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!tokenFromUrl) {
      setError("Missing reset token. Open the link from your email or dev reset flow.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenFromUrl, newPassword: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Reset failed. Link may have expired.");
        return;
      }
      setDone(true);
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
              <h2>New password</h2>
              <h1>Choose a new password</h1>
            </header>

            {done ? (
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 15,
                  color: "#1a1a1a",
                }}
              >
                Your password was updated. You can{" "}
                <Link to="/login" style={{ color: "#4c0b1a", fontWeight: 600 }}>
                  log in
                </Link>{" "}
                now.
              </p>
            ) : (
              <form className="login-form" onSubmit={submit}>
                {!tokenFromUrl && (
                  <p style={{ color: "#b00020", fontSize: 14, marginBottom: 8 }}>
                    No reset token in this page URL. Use the link from the forgot
                    password step.
                  </p>
                )}
                <div className="login-field">
                  <label htmlFor="rp-pass" className="sr-only">
                    New password
                  </label>
                  <input
                    className="login-input"
                    id="rp-pass"
                    type="password"
                    placeholder="New password (min 6 characters)"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="login-field">
                  <label htmlFor="rp-confirm" className="sr-only">
                    Confirm password
                  </label>
                  <input
                    className="login-input"
                    id="rp-confirm"
                    type="password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
                {error && (
                  <p style={{ color: "red", fontSize: 14, marginBottom: 8 }}>
                    {error}
                  </p>
                )}
                <div className="login-actions">
                  <button
                    className="login-btn-primary"
                    type="submit"
                    disabled={busy || !tokenFromUrl}
                  >
                    {busy ? "Saving…" : "Update password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
