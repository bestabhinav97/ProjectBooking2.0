import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import TopBar from "../../components/TopBar";
import Header from "../../components/Header";
import RoomList from "../../components/room-select/RoomList";
import "../../styles/pages/room-select/room-select.css";
import Footer from "../../components/Footer";
import RoomPageModifyBar from "../../components/room-select/RoomPageModifyBar";

function RoomSelect() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract variables from the initial search box redirect
  const rooms = location.state?.rooms || [];
  const totalGuests = location.state?.totalGuests || 1;
  const fromDate = location.state?.fromDate || null;
  const toDate = location.state?.toDate || null;

  const [availableRooms, setAvailableRooms] = useState([]);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    beds: "any",
    roomType: "any",
    minPrice: 0,
    maxPrice: 0,
    statusAvailable: true,
    statusUnavailable: true,
    sortBy: "default",
  });

  // ===== 1. FIXED THE EFFECT KICK-BACK LOOP =====
  useEffect(() => {
    // Check for the 'rooms' key passed from BookingBox.jsx
    if (!location.state?.rooms) {
      navigate("/");
      return;
    }

    // Set the data payload directly into state
    setAvailableRooms(location.state.rooms);
  }, [location.state, navigate]);

  // ===== 2. FIXED DATA EXTRACTION PATH =====
  // Since we already extracted .data inside BookingBox.jsx, availableRooms is now the flat array!
  const roomsData = useMemo(() => {
    return Array.isArray(availableRooms) ? availableRooms : [];
  }, [availableRooms]);

  // Derive price bounds from data
  const priceBounds = useMemo(() => {
    if (!roomsData.length) return { min: 0, max: 0 };
    const prices = roomsData.map((r) => Number(r.pricePerNight) || 0);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [roomsData]);

  useEffect(() => {
    // Initialize price filters when rooms arrive
    if (priceBounds.max > 0) {
      setFilters((f) => ({
        ...f,
        minPrice: priceBounds.min,
        maxPrice: priceBounds.max,
      }));
    }
  }, [priceBounds.min, priceBounds.max]);

  const bedOptions = useMemo(() => {
    const set = new Set(roomsData.map((r) => r.noOfBeds));
    return Array.from(set).sort((a, b) => a - b);
  }, [roomsData]);

  const filteredRooms = useMemo(() => {
    return roomsData
      .filter((r) => {
        if (!r) return false;

        if (filters.search) {
          const s = String(filters.search).toLowerCase();
          if (!String(r.roomNumber).toLowerCase().includes(s)) return false;
        }

        if (
          filters.beds !== "any" &&
          Number(r.noOfBeds) !== Number(filters.beds)
        )
          return false;

        if (
          filters.roomType !== "any" &&
          String(r.roomType).toLowerCase() !==
            String(filters.roomType).toLowerCase()
        )
          return false;

        const price = Number(r.pricePerNight) || 0;
        if (
          price < Number(filters.minPrice) ||
          price > Number(filters.maxPrice)
        )
          return false;

        if (!filters.statusAvailable && r.status === "available") return false;
        if (!filters.statusUnavailable && r.status !== "available")
          return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "priceAsc")
          return Number(a.pricePerNight) - Number(b.pricePerNight);
        if (filters.sortBy === "priceDesc")
          return Number(b.pricePerNight) - Number(a.pricePerNight);
        if (filters.sortBy === "bedsAsc")
          return Number(a.noOfBeds) - Number(b.noOfBeds);
        if (filters.sortBy === "bedsDesc")
          return Number(b.noOfBeds) - Number(a.noOfBeds);
        return 0;
      });
  }, [roomsData, filters]);

  function resetFilters() {
    setFilters({
      search: "",
      beds: "any",
      roomType: "any",
      minPrice: priceBounds.min || 0,
      maxPrice: priceBounds.max || 0,
      statusAvailable: true,
      statusUnavailable: true,
      sortBy: "default",
    });
  }

  return (
    <div>
      <TopBar />
      <Header />

      <RoomPageModifyBar />

      <div className="room-select-container">
        <aside className="filters">
          <h3>Filters</h3>

          <label>Search room number</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            placeholder="e.g. 101"
          />

          <label>Number of beds</label>
          <select
            value={filters.beds}
            onChange={(e) =>
              setFilters((f) => ({ ...f, beds: e.target.value }))
            }
          >
            <option value="any">Any</option>
            {bedOptions.map((b) => (
              <option key={b} value={b}>
                {b} bed{b > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <label>Room Type</label>
          <select
            value={filters.roomType}
            onChange={(e) =>
              setFilters((f) => ({ ...f, roomType: e.target.value }))
            }
          >
            <option value="any">Any</option>
            <option value="single">Single</option>
            <option value="superior">Superior</option>
            <option value="suite">Suite</option>
          </select>

          <label>Price range (€)</label>
          <div className="price-row">
            <input
              type="number"
              value={filters.minPrice}
              min={priceBounds.min}
              max={filters.maxPrice}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minPrice: Number(e.target.value) }))
              }
            />
            <span>—</span>
            <input
              type="number"
              value={filters.maxPrice}
              min={filters.minPrice}
              max={priceBounds.max}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
              }
            />
          </div>

          <label>Status</label>
          <div className="status-row">
            <label>
              <input
                type="checkbox"
                checked={filters.statusAvailable}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    statusAvailable: e.target.checked,
                  }))
                }
              />
              Available
            </label>

            <label>
              <input
                type="checkbox"
                checked={filters.statusUnavailable}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    statusUnavailable: e.target.checked,
                  }))
                }
              />
              Unavailable
            </label>
          </div>

          <label>Sort</label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sortBy: e.target.value }))
            }
          >
            <option value="default">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="bedsAsc">Beds: Fewest</option>
            <option value="bedsDesc">Beds: Most</option>
          </select>

          <div className="filter-actions">
            <button onClick={resetFilters} className="reset-btn">
              Reset
            </button>
          </div>
        </aside>

        <main className="rooms-area">
          <RoomList
            rooms={filteredRooms}
            totalGuests={totalGuests}
            fromDate={fromDate}
            toDate={toDate}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default RoomSelect;
