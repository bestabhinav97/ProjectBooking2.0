import { NavLink, useNavigate } from "react-router-dom";
import hotelImage from "../assets/grid4.jpg";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";
import "../styles/AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleLogout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      navigate("/login");
    }
  }

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-brand">
          <h1>Aurora</h1>
          <p>Admin</p>
        </div>

        <nav className="admin-sidebar-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/reservations">Reservations</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/rooms">Rooms</NavLink>
          <NavLink to="/">Main page</NavLink>
        </nav>
      </div>

      <div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>

        <div className="admin-hotel-card">
          <img src={hotelImage} alt="Aurora Hotel" />

          <div className="admin-hotel-info">
            <h3>Aurora Hotel</h3>
            <p>Södra Blasieholmshamnen 2</p>
            <p>111 48 Stockholm</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;