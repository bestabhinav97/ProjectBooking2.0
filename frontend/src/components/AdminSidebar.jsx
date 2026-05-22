import { Link } from "react-router-dom"; // Pull route handling links
import "../styles/AdminSidebar.css";
import hotelImage from "../assets/grid4.jpg";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-brand">
          <h1>Aurora</h1>
          <p>Admin</p>
        </div>

        <nav className="admin-sidebar-nav">
          {/* Use proper, semantic route linking layout paths */}
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/reservations">Reservations</Link>
          <Link to="/admin/guests">Guests</Link>
          <Link to="/admin/rooms">Rooms</Link>
          <Link to="/admin/messages">Messages</Link>
          <Link to="/admin/settings">Settings</Link>
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