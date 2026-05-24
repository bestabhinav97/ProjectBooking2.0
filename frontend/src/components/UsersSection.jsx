import { useEffect, useMemo, useState } from "react";
import "../styles/usersSection.css";
import { API_BASE } from "../config/api";

const ADMIN_API_BASE = API_BASE || "http://localhost:3000";

const roleOptions = ["customer", "staff", "admin"];

function UsersSection() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    customers: 0,
    staff: 0,
    admins: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(`${ADMIN_API_BASE}/admin/users`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load users");
      }

      setUsers(result.data.users || []);
      setStats(
        result.data.stats || {
          totalUsers: 0,
          customers: 0,
          staff: 0,
          admins: 0,
        }
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleRoleChange(userId, newRole) {
    try {
      setUpdatingUserId(userId);

      const response = await fetch(
        `${ADMIN_API_BASE}/admin/users/${userId}/role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update role");
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.userId === userId ? { ...user, role: newRole } : user
        )
      );

      await fetchUsers();
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = `
        ${user.name || ""}
        ${user.firstName || ""}
        ${user.lastName || ""}
        ${user.email || ""}
        ${user.phoneNumber || ""}
        ${user.country || ""}
        ${user.zipCode || ""}
        ${user.role || ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  return (
    <section className="users-section">
      <div className="users-header">
        <div>
          <p className="users-kicker">Admin management</p>
          <h1>Users</h1>
          <p>
            View all registered users, guests, staff and admins
          </p>
        </div>
      </div>

      {loading && <p className="admin-reservations-message">Loading users...</p>}

      {errorMessage && (
        <p className="admin-reservations-message error-msg">{errorMessage}</p>
      )}

      {!loading && !errorMessage && (
        <>
          <div className="users-stats-grid">
            <article className="users-stat-card">
              <p>Total users</p>
              <h2>{stats.totalUsers}</h2>
              <span>All accounts</span>
            </article>

            <article className="users-stat-card">
              <p>Guests</p>
              <h2>{stats.customers}</h2>
              <span>Customer accounts</span>
            </article>

            <article className="users-stat-card">
              <p>Staff</p>
              <h2>{stats.staff}</h2>
              <span>Staff accounts</span>
            </article>

            <article className="users-stat-card">
              <p>Admins</p>
              <h2>{stats.admins}</h2>
              <span>Admin accounts</span>
            </article>
          </div>

          <div className="users-toolbar">
            <input
              type="search"
              placeholder="Search by name, email, phone, country, zip code or role..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="all">All roles</option>
              <option value="customer">Guests</option>
              <option value="staff">Staff</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div className="users-table-card">
            <div className="users-table-header">
              <div>
                <p className="users-kicker">User database</p>
                <h2>Account information</h2>
              </div>

              <span className="users-count">
                Showing {filteredUsers.length} of {users.length}
              </span>
            </div>

            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Country</th>
                    <th>Birth date</th>
                    <th>Zip code</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const initials = (user.name || "U")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    const roleClass = `users-role-${(user.role || "customer")
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`;

                    return (
                      <tr key={user.userId}>
                        <td>
                          <div className="users-name-cell">
                            <div className="users-avatar">{initials}</div>

                            <div>
                              <strong>{user.name || "Unnamed user"}</strong>
                              <span>ID #{user.userId}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="users-contact-cell">
                            <span>{user.email || "No email"}</span>
                            <span>{user.phoneNumber || "No phone"}</span>
                          </div>
                        </td>

                        <td>{user.country || "-"}</td>
                        <td>{user.birthDate || "-"}</td>
                        <td>{user.zipCode || "-"}</td>

                        <td>
                          <select
                            className={`users-role-select ${roleClass}`}
                            value={user.role || "customer"}
                            disabled={updatingUserId === user.userId}
                            onChange={(event) =>
                              handleRoleChange(user.userId, event.target.value)
                            }
                          >
                            {roleOptions.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <p className="users-empty">No users match your search.</p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default UsersSection;