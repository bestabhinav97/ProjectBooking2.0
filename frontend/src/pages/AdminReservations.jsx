import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminReservations.css";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track which booking is being edited row-by-row
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    roomNumber: "",
    fromDate: "",
    toDate: "",
    totalCost: "",
    status: "",
  });

  // Fetch data on load
  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchAllReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/bookings/admin/allBookings", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch records.");
      setReservations(result.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Error running database query.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation record?")) return;
    try {
      const response = await fetch(`/bookings/admin/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete booking.");
      
      // Remove item from UI state immediately
      setReservations(reservations.filter((b) => (b.bookingId || b.id) !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Open inline editor row values
  const handleEditClick = (booking) => {
    const id = booking.bookingId || booking.id;
    setEditingId(id);
    setEditFormData({
      roomNumber: booking.roomNumber || "",
      fromDate: booking.fromDate || "",
      toDate: booking.toDate || "",
      totalCost: booking.totalCost || "",
      status: booking.status || "pending",
    });
  };

  // Handle input modifications within edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Save changes handler
  const handleSaveSubmit = async (id) => {
    try {
      const response = await fetch(`/bookings/admin/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update record.");

      // Sync state array matching the updated object values
      setReservations(
        reservations.map((b) =>
          (b.bookingId || b.id) === id ? { ...b, ...editFormData } : b
        )
      );
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-layout-container">
      <AdminSidebar />

      <main className="admin-main-view">
        <header className="admin-view-header">
          <h1>Master Reservations List</h1>
          <p>Complete historical customer record logging data lookup.</p>
        </header>

        <hr className="divider-line" />

        {loading && <p className="status-msg">Loading records...</p>}
        {error && <p className="status-msg error-msg">{error}</p>}

        {!loading && !error && (
          <div className="table-wrapper-box">
            <div className="table-header-row">
              <h2>All Active Bookings ({reservations.length})</h2>
            </div>
            
            {reservations.length === 0 ? (
              <p className="empty-msg">No records found in the database system.</p>
            ) : (
              <table className="custom-admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User ID</th>
                    <th>Room #</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((booking) => {
                    const id = booking.bookingId || booking.id;
                    const isEditing = editingId === id;

                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{booking.userId}</td>
                        
                        {/* Room input check */}
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              name="roomNumber"
                              className="table-inline-input"
                              value={editFormData.roomNumber}
                              onChange={handleInputChange}
                            />
                          ) : (
                            booking.roomNumber
                          )}
                        </td>

                        {/* Check-In input check */}
                        <td>
                          {isEditing ? (
                            <input
                              type="date"
                              name="fromDate"
                              className="table-inline-input"
                              value={editFormData.fromDate}
                              onChange={handleInputChange}
                            />
                          ) : (
                            booking.fromDate
                          )}
                        </td>

                        {/* Check-Out input check */}
                        <td>
                          {isEditing ? (
                            <input
                              type="date"
                              name="toDate"
                              className="table-inline-input"
                              value={editFormData.toDate}
                              onChange={handleInputChange}
                            />
                          ) : (
                            booking.toDate
                          )}
                        </td>

                        {/* Total Cost check */}
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              name="totalCost"
                              className="table-inline-input cost-input"
                              value={editFormData.totalCost}
                              onChange={handleInputChange}
                            />
                          ) : (
                            `$${booking.totalCost}`
                          )}
                        </td>

                        {/* Status Check selection */}
                        <td>
                          {isEditing ? (
                            <select
                              name="status"
                              className="table-inline-select"
                              value={editFormData.status}
                              onChange={handleInputChange}
                            >
                              <option value="pending">PENDING</option>
                              <option value="confirmed">CONFIRMED</option>
                              <option value="cancelled">CANCELLED</option>
                            </select>
                          ) : (
                            <span className={`status-badge ${booking.status}`}>
                              {(booking.status || "UNKNOWN").toUpperCase()}
                            </span>
                          )}
                        </td>

                        {/* Control Actions Column */}
                        <td>
                          <div className="action-btn-group">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveSubmit(id)}
                                  className="action-btn save-btn"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="action-btn cancel-btn"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditClick(booking)}
                                  className="action-btn edit-btn"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(id)}
                                  className="action-btn delete-btn"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminReservations;