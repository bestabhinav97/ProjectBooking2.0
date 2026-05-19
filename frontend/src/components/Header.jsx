import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        Hotel
      </Link>

      <Navbar />

      {user ? (
        <div className="header-user-section">
          {/* profile icon */}
          <div className="login-icon-circle">
            <svg
              className="login-icon"
              viewBox="0 -960 960 960"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M479.88-488.35q-72.33 0-118.17-45.84t-45.84-118.17q0-72.34 45.84-118.29 45.84-45.96 118.17-45.96 72.34 0 118.58 45.96 46.24 45.95 46.24 118.29 0 72.33-46.24 118.17t-118.58 45.84M145.87-217.74v-30.04q0-41.56 21.16-72.08 21.17-30.51 54.75-46.36 68.13-30.56 131.31-45.85 63.17-15.28 126.76-15.28 64.67 0 127.24 15.78 62.56 15.79 130.05 45.55 35.04 15.23 56.3 45.76 21.26 30.52 21.26 72.48v30.04q0 32.66-23.15 55.94t-56.64 23.28H225.09q-33.26 0-56.24-23.28t-22.98-55.94m79.22 0h509.82v-27.78q0-15.64-9.5-29.84t-23.5-21.03q-61.74-29.31-113.32-40.24t-108.87-10.93q-56.15 0-109.31 10.93-53.15 10.93-113.08 40.15-14.24 6.84-23.24 21.07-9 14.22-9 29.89zm254.79-349.83q36.86 0 60.95-24 24.08-24 24.08-60.89 0-37.13-23.97-61.03t-60.82-23.9q-36.86 0-60.95 23.93-24.08 23.93-24.08 60.72 0 37.03 23.97 61.1t60.82 24.07m.12 349.83" />
            </svg>
          </div>

          {/* user name */}
          <span className="login-text">{user.name}</span>

          {/* logout button */}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="header-login">
          <div className="login-icon-circle">
            <svg
              className="login-icon"
              viewBox="0 -960 960 960"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M479.88-488.35q-72.33 0-118.17-45.84t-45.84-118.17q0-72.34 45.84-118.29 45.84-45.96 118.17-45.96 72.34 0 118.58 45.96 46.24 45.95 46.24 118.29 0 72.33-46.24 118.17t-118.58 45.84M145.87-217.74v-30.04q0-41.56 21.16-72.08 21.17-30.51 54.75-46.36 68.13-30.56 131.31-45.85 63.17-15.28 126.76-15.28 64.67 0 127.24 15.78 62.56 15.79 130.05 45.55 35.04 15.23 56.3 45.76 21.26 30.52 21.26 72.48v30.04q0 32.66-23.15 55.94t-56.64 23.28H225.09q-33.26 0-56.24-23.28t-22.98-55.94m79.22 0h509.82v-27.78q0-15.64-9.5-29.84t-23.5-21.03q-61.74-29.31-113.32-40.24t-108.87-10.93q-56.15 0-109.31 10.93-53.15 10.93-113.08 40.15-14.24 6.84-23.24 21.07-9 14.22-9 29.89zm254.79-349.83q36.86 0 60.95-24 24.08-24 24.08-60.89 0-37.13-23.97-61.03t-60.82-23.9q-36.86 0-60.95 23.93-24.08 23.93-24.08 60.72 0 37.03 23.97 61.1t60.82 24.07m.12 349.83" />
            </svg>
          </div>

          <span className="login-text">Join Us / Login</span>
        </Link>
      )}
    </header>
  );
}

export default Header;
