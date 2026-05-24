import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";

function initials(user) {
  const a = (user.firstName || "").trim()[0] || "";
  const b = (user.lastName || "").trim()[0] || "";
  if (a || b) return (a + b).toUpperCase();
  return (user.email || "?").slice(0, 2).toUpperCase();
}

function displayFirstName(user) {
  const n = (user.firstName || "").trim();
  if (n) return n;
  const email = user.email || "";
  return email.split("@")[0] || "Guest";
}

export default function UserAccountMenu() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!user) return null;

  const avatarSrc =
    typeof user.profileImageUrl === "string" &&
    user.profileImageUrl.trim() !== ""
      ? user.profileImageUrl
      : null;

  const isAdmin = user.role === "admin";

  return (
    <div
      className={`has-dropdown account-menu-slot${
        open ? " dropdown-open" : ""
      }`}
      ref={ref}
    >
      <button
        type="button"
        className="account-menu-trigger-btn"
        onClick={() => setOpen((o) => !o)}
      >
        {avatarSrc ? (
          <img
            key={avatarSrc.slice(0, 80)}
            src={avatarSrc}
            alt=""
            className="account-menu-avatar-thumb"
          />
        ) : (
          <span className="account-menu-avatar-initials" aria-hidden>
            {initials(user)}
          </span>
        )}

        <span>Hi {displayFirstName(user)}!</span>
      </button>

      <ul className="dropdown account-menu-dropdown" role="menu">
        {isAdmin && (
          <li role="none">
            <Link to="/admin/dashboard" role="menuitem">
              Admin panel
            </Link>
          </li>
        )}

        <li role="none">
          <Link to="/my-bookings" role="menuitem">
            My stays
          </Link>
        </li>

        <li role="none">
          <Link to="/profile" role="menuitem">
            My profile
          </Link>
        </li>

        <li role="none">
          <button
            type="button"
            role="menuitem"
            className="account-menu-logout"
            onClick={logout}
          >
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
}