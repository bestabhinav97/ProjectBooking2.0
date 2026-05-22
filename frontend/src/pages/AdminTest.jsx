import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { API_BASE } from "../config/api"; // Matches your login pattern

function AdminTest() {
  // ========== STATE MANAGEMENT ==========
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // ========== FETCH LOGIC FUNCTION ==========
  const fetchAllReservations = async () => {
    setLoading(true);
    setError(null);
    setHasFetched(true);

    try {
      // Use your standard API_BASE configuration variable
      // Include credentials to pass your session login cookies to the backend
      const response = await fetch(`${API_BASE}/bookings/admin/allBookings`, {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch reservations.");
      }

      // Read from the data payload key returned by your controller
      setReservations(result.data || []);
    } catch (err) {
      console.error("Frontend Fetch Error:", err);
      setError(err.message || "Something went wrong while loading bookings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-test-page">
      <AdminSidebar onReservationsClick={fetchAllReservations} />

      <main className="admin-test-content">
        <h1>Admin Dashboard</h1>
        <p>Temporary testing page for admin panel layout.</p>

        <hr />

        {/* ========== CONDITIONAL RENDERING STATES ========== */}
        
        {/* Loading State */}
        {loading && <p className="loading-text">Loading master reservation records...</p>}

        {/* Error State */}
        {error && <p className="error-text" style={{ color: "red" }}>{error}</p>}

        {/* Data Display Table */}
        {hasFetched && !loading && !error && (
          <div className="reservations-section">
            <h2>Master Reservation Records ({reservations.length})</h2>
            
            {reservations.length === 0 ? (
              <p>No reservations found in the system database.</p>
            ) : (
              <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                    <th>Booking ID</th>
                    <th>User ID</th>
                    <th>Room #</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((booking) => (
                    <tr key={booking.bookingId || booking.id}>
                      <td>{booking.bookingId || booking.id}</td>
                      <td>{booking.userId}</td>
                      <td>{booking.roomNumber}</td>
                      <td>{booking.fromDate}</td>
                      <td>{booking.toDate}</td>
                      <td>${booking.totalCost}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {(booking.status || "UNKNOWN").toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminTest;