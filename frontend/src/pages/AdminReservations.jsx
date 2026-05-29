import React, { useState, useEffect } from "react";
import "../styles/usersSection.css";
import "../styles/AdminReservations.css";
import { API_BASE } from "../config/api";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    roomNumber: "",
    fromDate: "",
    toDate: "",
    totalCost: "",
    status: "",
  });

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchAllReservations = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/bookings/admin/allBookings`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
},
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch records.");
      }

      setReservations(result.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Error running database query.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/bookings/admin/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
},
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete booking.");
      }

      setReservations((currentReservations) =>
        currentReservations.filter((booking) => {
          return (booking.bookingId || booking.id) !== id;
        })
      );
    } catch (err) {
      alert(err.message);
    }
  };

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveSubmit = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/bookings/admin/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
},
        body: JSON.stringify(editFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update record.");
      }

      setReservations((currentReservations) =>
        currentReservations.map((booking) =>
          (booking.bookingId || booking.id) === id
            ? { ...booking, ...editFormData }
            : booking
        )
      );

      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="users-section">
      <div className="users-header">
        <div>
          <p className="users-kicker">Admin management</p>

          <h1>Reservations</h1>

          <p>
            View all hotel reservations, update booking details, manage statuses
            and maintain reservation records
          </p>
        </div>
      </div>

      {loading && <p className="admin-reservations-message">Loading records...</p>}

      {error && (
        <p className="admin-reservations-message error-msg">{error}</p>
      )}

      {!loading && !error && (
        <div className="users-table-card">
          <div className="users-table-header">
            <div>
              <p className="users-kicker">Reservation database</p>
              <h2>Booking information</h2>
            </div>

            <span className="users-count">
              Showing {reservations.length} records
            </span>
          </div>

          <div className="admin-reservations-table-wrapper">
            {reservations.length === 0 ? (
              <p className="users-empty">No reservations found.</p>
            ) : (
              <table className="admin-reservations-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User ID</th>
                    <th>Room</th>
                    <th>Check in</th>
                    <th>Check out</th>
                    <th>Total cost</th>
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
                            `${Number(booking.totalCost || 0).toLocaleString()} SEK`
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              name="status"
                              className="table-inline-select"
                              value={editFormData.status}
                              onChange={handleInputChange}
                            >
                              <option value="pending">pending</option>
                              <option value="confirmed">confirmed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          ) : (
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status || "unknown"}
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="action-btn-group">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSaveSubmit(id)}
                                  className="action-btn save-btn"
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="action-btn cancel-btn"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(booking)}
                                  className="action-btn edit-btn"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
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
        </div>
      )}
    </section>
  );
}

export default AdminReservations;