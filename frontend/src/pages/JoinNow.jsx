import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import "../styles/joinnow.css";

function JoinNow() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    // Convert FormData to a plain object
    const userData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3000/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // This catches errors sent from your Express validation logic
        throw new Error(
          data.message || "Something went wrong. Please try again.",
        );
      }

      alert("Welcome to the family! Account created.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 90 },
    (_, index) => currentYear - 13 - index,
  );

  return (
    <div className="join-page">
      <TopBar />
      <Header />

      <main className="join-main">
        <section className="join-card">
          <div className="join-form-section">
            <div className="join-form-intro">
              <p className="join-cursive">Let&apos;s be friends!</p>
              <h1>Join Hotel Friends</h1>
              <p>
                Create your account to get member offers, faster booking and
                special hotel rewards.
              </p>
            </div>

            {/* Error Message Display */}
            {error && <div className="error-banner">{error}</div>}

            <form className="join-form" onSubmit={handleSubmit}>
              <h2 className="join-section-title">Contact information</h2>

              <div className="join-grid-two">
                <div className="join-field">
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div className="join-field">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="join-field">
                <label>Birth date</label>
                <div className="join-grid-three">
                  <select name="birthDay" defaultValue="" required>
                    <option value="" disabled>
                      Day
                    </option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <select name="birthMonth" defaultValue="" required>
                    <option value="" disabled>
                      Month
                    </option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select name="birthYear" defaultValue="" required>
                    <option value="" disabled>
                      Year
                    </option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="join-grid-two">
                <div className="join-field">
                  <label htmlFor="zipCode">Zip code</label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    placeholder="Enter zip code"
                    required
                  />
                </div>

                <div className="join-field">
                  <label htmlFor="country">Country</label>
                  <select id="country" name="country" defaultValue="" required>
                    <option value="" disabled>
                      Select country
                    </option>
                    <option value="Sweden">Sweden</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Norway">Norway</option>
                    <option value="Finland">Finland</option>
                    <option value="Germany">Germany</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="join-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="join-field">
                <label htmlFor="phoneNumber">Phone number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+46 Phone number"
                  required
                />
              </div>

              <h2 className="join-section-title">Password</h2>

              <div className="join-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength="6"
                  required
                />
              </div>

              <label className="join-checkbox">
                <input type="checkbox" name="terms" required />
                <span>I accept the membership terms and privacy policy.</span>
              </label>

              <button
                className="join-primary-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Join Hotel Friends"}
              </button>
            </form>
          </div>

          <aside className="join-info-section">
            <div className="join-info-inner">
              <p className="join-cursive">Already a friend?</p>
              <h2>Log in to your account</h2>
              <p>
                If you already have an account, log in to continue booking rooms
                and managing your membership.
              </p>
              <Link to="/login" className="join-secondary-btn">
                Log in
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default JoinNow;
