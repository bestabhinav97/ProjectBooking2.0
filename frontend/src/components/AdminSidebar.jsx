import { NavLink } from "react-router-dom";
import hotelImage from "../assets/grid4.jpg";
import "../styles/AdminSidebar.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-brand">
          <h1>Aurora</h1>
          <p>Admin</p>
        </div>

        <nav className="admin-sidebar-nav">
          <NavLink to="/admin-test" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin-test/reservations">
            Reservations
          </NavLink>

          <NavLink to="/admin-test/users">
            Users
          </NavLink>

          <NavLink to="/admin-test/rooms">
            Rooms
          </NavLink>

          <NavLink to="/admin-test/messages">
            Messages
          </NavLink>

          <NavLink to="/admin-test/settings">
            Settings
          </NavLink>
        </nav>
      </div>

      <div className="admin-hotel-card">
        <img src={hotelImage} alt="Aurora Hotel" />

        <div className="admin-hotel-info">
          <h3>Aurora Hotel</h3>
          <p>Södra Blasieholmshamnen 2</p>
          <p>111 48 Stockholm</p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;