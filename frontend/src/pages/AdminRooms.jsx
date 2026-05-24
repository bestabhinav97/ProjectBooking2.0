import { useEffect, useState } from "react";
import "../styles/usersSection.css";
import "../styles/AdminRooms.css";
import { API_BASE } from "../config/api";

const ADMIN_API_BASE = API_BASE || "http://localhost:3000";

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    roomNumber: "",
    noOfBeds: "",
    status: "available",
    pricePerNight: "",
    type: "single",
  });

  const [editingRoomNumber, setEditingRoomNumber] = useState(null);

  const [editFormData, setEditFormData] = useState({
    noOfBeds: "",
    status: "available",
    pricePerNight: "",
    type: "single",
  });

  async function fetchRooms() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(`${ADMIN_API_BASE}/admin/rooms`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load rooms");
      }

      setRooms(data.data || []);
    } catch (error) {
      console.error("ROOM FETCH ERROR:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRoom(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${ADMIN_API_BASE}/admin/rooms`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber: Number(formData.roomNumber),
          noOfBeds: Number(formData.noOfBeds),
          status: formData.status,
          pricePerNight: Number(formData.pricePerNight),
          type: formData.type,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create room");
      }

      setFormData({
        roomNumber: "",
        noOfBeds: "",
        status: "available",
        pricePerNight: "",
        type: "single",
      });

      setShowAddPopup(false);
      fetchRooms();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleEditClick(room) {
    setEditingRoomNumber(room.roomNumber);

    setEditFormData({
      noOfBeds: room.noOfBeds,
      status: room.status,
      pricePerNight: room.pricePerNight,
      type: room.type,
    });
  }

  async function handleSaveEdit(roomNumber) {
    try {
      const response = await fetch(
        `${ADMIN_API_BASE}/admin/rooms/${roomNumber}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            noOfBeds: Number(editFormData.noOfBeds),
            status: editFormData.status,
            pricePerNight: Number(editFormData.pricePerNight),
            type: editFormData.type,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update room");
      }

      setEditingRoomNumber(null);
      fetchRooms();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(roomNumber) {
    if (!window.confirm(`Delete room ${roomNumber}?`)) return;

    try {
      const response = await fetch(
        `${ADMIN_API_BASE}/admin/rooms/${roomNumber}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete room");
      }

      setRooms((currentRooms) =>
        currentRooms.filter((room) => room.roomNumber !== roomNumber)
      );
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = String(room.roomNumber)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || room.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <section className="users-section">
      <div className="users-header">
        <div>
          <p className="users-kicker">Admin management</p>

          <h1>Rooms</h1>

          <p>
            View all hotel rooms, manage pricing, room types, availability and
            update room information 
          </p>
        </div>
      </div>

      {loading && <p className="admin-rooms-loading">Loading rooms...</p>}

      {errorMessage && (
        <p className="admin-rooms-loading error-msg">{errorMessage}</p>
      )}

      {!loading && !errorMessage && (
        <>
          <div className="admin-rooms-top-actions">
            <button
              type="button"
              className="admin-add-room-btn"
              onClick={() => setShowAddPopup(true)}
            >
              Add Room
            </button>
          </div>

          {showAddPopup && (
            <div className="admin-room-modal-backdrop">
              <div className="admin-room-modal">
                <div className="admin-room-modal-header">
                  <div>
                    <p className="users-kicker">New room</p>
                    <h2>Add room</h2>
                  </div>

                  <button
                    type="button"
                    className="admin-room-modal-close"
                    onClick={() => setShowAddPopup(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateRoom} className="admin-room-form">
                  <label>
                    Room number
                    <input
                      type="number"
                      placeholder="Enter room number"
                      value={formData.roomNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          roomNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Beds
                    <input
                      type="number"
                      placeholder="Number of beds"
                      value={formData.noOfBeds}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          noOfBeds: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Price per night
                    <input
                      type="number"
                      placeholder="Price per night"
                      value={formData.pricePerNight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricePerNight: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Room type
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="single">single</option>
                      <option value="superior">superior</option>
                      <option value="suite">suite</option>
                    </select>
                  </label>

                  <label>
                    Status
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="available">available</option>
                      <option value="maintenance">maintenance</option>
                      <option value="unavailable">unavailable</option>
                    </select>
                  </label>

                  <div className="admin-room-modal-actions">
                    <button
                      type="button"
                      className="admin-room-btn secondary"
                      onClick={() => setShowAddPopup(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="admin-room-btn primary">
                      Save room
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="admin-rooms-toolbar">
            <input
              type="text"
              placeholder="Search room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All room types</option>
              <option value="single">Single</option>
              <option value="superior">Superior</option>
              <option value="suite">Suite</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div className="users-table-card">
            <div className="users-table-header">
              <div>
                <p className="users-kicker">Room database</p>
                <h2>Room information</h2>
              </div>

              <span className="users-count">
                Showing {filteredRooms.length} of {rooms.length}
              </span>
            </div>

            <div className="admin-rooms-table-wrapper">
              <table className="admin-rooms-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Beds</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRooms.map((room) => {
                    const isEditing = editingRoomNumber === room.roomNumber;

                    return (
                      <tr key={room.roomNumber}>
                        <td>{room.roomNumber}</td>

                        <td>
                          {isEditing ? (
                            <select
                              className="admin-room-inline-input"
                              value={editFormData.type}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  type: e.target.value,
                                })
                              }
                            >
                              <option value="single">single</option>
                              <option value="superior">superior</option>
                              <option value="suite">suite</option>
                            </select>
                          ) : (
                            room.type
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className="admin-room-inline-input"
                              type="number"
                              value={editFormData.noOfBeds}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  noOfBeds: e.target.value,
                                })
                              }
                            />
                          ) : (
                            room.noOfBeds
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className="admin-room-inline-input"
                              type="number"
                              value={editFormData.pricePerNight}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  pricePerNight: e.target.value,
                                })
                              }
                            />
                          ) : (
                            `${room.pricePerNight} SEK`
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              className="admin-room-inline-input"
                              value={editFormData.status}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  status: e.target.value,
                                })
                              }
                            >
                              <option value="available">available</option>
                              <option value="maintenance">maintenance</option>
                              <option value="unavailable">unavailable</option>
                            </select>
                          ) : (
                            <span
                              className={`admin-room-status ${room.status}`}
                            >
                              {room.status}
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="admin-room-action-group">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="admin-room-action save"
                                  onClick={() =>
                                    handleSaveEdit(room.roomNumber)
                                  }
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  className="admin-room-action cancel"
                                  onClick={() => setEditingRoomNumber(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="admin-room-action edit"
                                  onClick={() => handleEditClick(room)}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="admin-room-action delete"
                                  onClick={() => handleDelete(room.roomNumber)}
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

              {filteredRooms.length === 0 && (
                <p className="users-empty">No rooms match your search.</p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminRooms;