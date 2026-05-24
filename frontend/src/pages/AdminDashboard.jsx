import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { API_BASE } from "../config/api";
import "../styles/usersSection.css";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeGuests: 0,
    occupancyRate: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAndCalculateStats();
  }, []);

  const fetchAndCalculateStats = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/bookings/admin/allBookings`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch dashboard metrics.");
      }

      const bookingsArray = result.data || [];

      let grossRevenue = 0;
      let confirmedCount = 0;

      const monthlyMap = {};

      const monthsList = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      bookingsArray.forEach((booking) => {
        const cost = parseFloat(booking.totalCost || 0);

        if (booking.status === "confirmed") {
          grossRevenue += cost;
          confirmedCount++;
        }

        if (booking.fromDate) {
          const dateObj = new Date(booking.fromDate);
          const monthLabel = monthsList[dateObj.getMonth()];
          const yearLabel = dateObj.getFullYear();
          const mapKey = `${monthLabel} ${yearLabel}`;

          if (!monthlyMap[mapKey]) {
            monthlyMap[mapKey] = {
              name: mapKey,
              Bookings: 0,
              Revenue: 0,
            };
          }

          monthlyMap[mapKey].Bookings += 1;

          if (booking.status === "confirmed") {
            monthlyMap[mapKey].Revenue += cost;
          }
        }
      });

      const sortedChartData = Object.values(monthlyMap).sort((a, b) => {
        return new Date(a.name) - new Date(b.name);
      });

      setStats({
        totalRevenue: grossRevenue,
        totalBookings: bookingsArray.length,
        activeGuests: confirmedCount,
        occupancyRate: Math.min(Math.round((confirmedCount / 17) * 100), 100),
      });

      setChartData(sortedChartData);
    } catch (err) {
      console.error("Dashboard calculation error:", err);
      setError(err.message || "Could not parse statistics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="users-section">
      <div className="users-header">
        <div>
          <p className="users-kicker">Admin management</p>

          <h1>Dashboard</h1>

          <p>
            View real-time analytics, booking activity, revenue performance and
            occupancy insights
          </p>
        </div>
      </div>

      {loading ? (
        <p className="admin-dashboard-message">Loading system metrics...</p>
      ) : error ? (
        <p className="admin-dashboard-message error-msg">{error}</p>
      ) : (
        <>
          <div className="stats-summary-grid">
            <div className="stat-card-item">
              <span className="stat-label">Gross revenue</span>
              <h2 className="stat-value">
                SEK {stats.totalRevenue.toLocaleString()}
              </h2>
              <span className="stat-trend positive">Live DB sync</span>
            </div>

            <div className="stat-card-item">
              <span className="stat-label">Total reservations</span>
              <h2 className="stat-value">{stats.totalBookings}</h2>
              <span className="stat-trend positive">All rows loaded</span>
            </div>

            <div className="stat-card-item">
              <span className="stat-label">Confirmed bookings</span>
              <h2 className="stat-value">{stats.activeGuests}</h2>
              <span className="stat-trend neutral">Paid status</span>
            </div>

            <div className="stat-card-item">
              <span className="stat-label">Current occupancy</span>
              <h2 className="stat-value">{stats.occupancyRate}%</h2>
              <span className="stat-trend positive">Dynamic ratio</span>
            </div>
          </div>

          <div className="dashboard-split-panels">
            <div className="panel-box-item main-split">
              <h3>Monthly Revenue Trajectory</h3>

              <div style={{ width: "100%", height: "220px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0052cc"
                          stopOpacity={0.3}
                        />

                        <stop
                          offset="95%"
                          stopColor="#0052cc"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#eef0f2"
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#697386"
                      tickLine={false}
                      style={{ fontSize: "0.8rem" }}
                    />

                    <YAxis
                      stroke="#697386"
                      tickLine={false}
                      style={{ fontSize: "0.8rem" }}
                    />

                    <Tooltip
                      formatter={(value) => [`SEK ${value}`, "Revenue"]}
                    />

                    <Area
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#0052cc"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel-box-item side-split">
              <h3>Reservation Metrics</h3>

              <div style={{ width: "100%", height: "220px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#eef0f2"
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#697386"
                      tickLine={false}
                      style={{ fontSize: "0.8rem" }}
                    />

                    <YAxis
                      stroke="#697386"
                      tickLine={false}
                      style={{ fontSize: "0.8rem" }}
                    />

                    <Tooltip />

                    <Legend
                      iconSize={10}
                      wrapperStyle={{ fontSize: "0.75rem", pt: 10 }}
                    />

                    <Bar
                      dataKey="Bookings"
                      fill="#00875a"
                      radius={[3, 3, 0, 0]}
                      name="Bookings"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminDashboard;