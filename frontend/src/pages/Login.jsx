import { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setUser(data.user ?? data);
      console.log("hello");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <TopBar />

      <header className="login-page-header">
        <Link to="/" className="login-back-link">
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
          Go back to Hotel.com
        </Link>
        <div className="login-logo-center">
          <Link to="/" className="login-logo-text">
            Hotel
          </Link>
        </div>
        <div className="login-header-spacer" aria-hidden />
      </header>

      <main className="login-main">
        <div className="login-card">
          <div className="login-form-section">
            <header className="login-form-intro">
              <h2>Welcome!</h2>
              <h1>Please log in</h1>
            </header>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-field">
                <label htmlFor="login-email" className="sr-only">
                  Email or membership number
                </label>
                <input
                  className="login-input"
                  id="login-email"
                  name="email"
                  type="text"
                  placeholder="Email / Membership number"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="login-field">
                <label htmlFor="login-password" className="sr-only">
                  Password
                </label>
                <input
                  className="login-input"
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p
                  style={{
                    color: "red",
                    fontSize: "14px",
                    marginBottom: "10px",
                  }}
                >
                  {error}
                </p>
              )}

              <div className="login-options-row">
                <label className="login-remember">
                  <input type="checkbox" name="remember" />
                  <span>Keep me logged in</span>
                </label>
                <a className="login-forgot" href="#">
                  Forgot password
                </a>
              </div>
              <div className="login-actions">
                <button className="login-btn-primary" type="submit">
                  Log in
                </button>

                <div className="login-separator">
                  <span>or</span>
                </div>

                <button className="login-btn-outline" type="button">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Email a verification link
                </button>
              </div>
            </form>
          </div>

          <div className="login-membership-section">
            <div className="login-membership-inner">
              <div className="login-membership-content">
                <p className="login-cursive">Let&apos;s be friends!</p>

                <h2>Not a member? Join us!</h2>

                <Link to="/joinnow" className="login-btn-join">
                  Join Hotel Friends
                </Link>

                <hr className="login-membership-divider" />

                <p className="login-membership-copy">
                  Get offers, discounts, surprises and other great things. Like
                  free reward nights at our hotels. Because hey, only the best
                  for friends, right?
                </p>
                <a className="login-read-more" href="#">
                  Read more
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
