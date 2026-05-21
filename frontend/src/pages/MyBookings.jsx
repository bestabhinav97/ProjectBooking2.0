import { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import singleImg from "../assets/single-room.jpg";
import superiorImg from "../assets/superior-room.jpg";
import suiteImg from "../assets/suite-room.jpg";
import "../styles/myBookings.css";

const ROOM_IMAGES = {
  single: singleImg,
  superior: superiorImg,
  suite: suiteImg,
};

const MOCK_BOOKINGS = [
  {
    bookingId: 1001,
    roomNumber: 301,
    roomType: "suite",
    status: "confirmed",
    fromDate: "2026-06-10",
    toDate: "2026-06-13",
    totalCost: 360.0,
  },
  {
    bookingId: 1002,
    roomNumber: 201,
    roomType: "superior",
    status: "confirmed",
    fromDate: "2026-07-05",
    toDate: "2026-07-08",
    totalCost: 255.0,
  },
  {
    bookingId: 1003,
    roomNumber: 101,
    roomType: "single",
    status: "pending",
    fromDate: "2026-08-01",
    toDate: "2026-08-03",
    totalCost: 100.0,
  },
  {
    bookingId: 1004,
    roomNumber: 202,
    roomType: "superior",
    status: "cancelled",
    fromDate: "2026-05-01",
    toDate: "2026-05-04",
    totalCost: 255.0,
  },
  {
    bookingId: 1005,
    roomNumber: 102,
    roomType: "single",
    status: "confirmed",
    fromDate: "2026-04-10",
    toDate: "2026-04-12",
    totalCost: 100.0,
  },
];

const TABS = ["All", "Upcoming", "Past", "Cancelled"];

const ROOM_LABELS = {
  single: "Single Room",
  superior: "Superior Room",
  suite: "Suite",
};

const ROOM_ROUTES = {
  single: "/rooms/single",
  superior: "/rooms/superior",
  suite: "/rooms/suite",
};

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function nightCount(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function isUpcoming(booking) {
  return (
    new Date(booking.fromDate) > new Date() &&
    booking.status !== "cancelled"
  );
}

function isPast(booking) {
  return (
    new Date(booking.toDate) < new Date() &&
    booking.status !== "cancelled"
  );
}

function filterBookings(bookings, tab) {
  if (tab === "Upcoming") return bookings.filter(isUpcoming);
  if (tab === "Past") return bookings.filter(isPast);
  if (tab === "Cancelled") return bookings.filter((b) => b.status === "cancelled");
  return bookings;
}

function StatusBadge({ status }) {
  return (
    <span className={`mb-status-badge mb-status-badge--${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function BookingCard({ booking }) {
  const nights = nightCount(booking.fromDate, booking.toDate);
  const canCancel =
    booking.status !== "cancelled" && new Date(booking.fromDate) > new Date();

  return (
    <article className="mb-card">
      <div className="mb-card-image-wrap">
        <img
          src={ROOM_IMAGES[booking.roomType]}
          alt={ROOM_LABELS[booking.roomType]}
          className="mb-card-image"
        />
        <StatusBadge status={booking.status} />
      </div>

      <div className="mb-card-body">
        <div className="mb-card-top">
          <div>
            <p className="mb-room-type">{ROOM_LABELS[booking.roomType]}</p>
            <p className="mb-booking-meta">
              Booking&nbsp;#{booking.bookingId} &nbsp;·&nbsp; Room&nbsp;
              {booking.roomNumber}
            </p>
          </div>
          <p className="mb-total">${booking.totalCost.toFixed(2)}</p>
        </div>

        <div className="mb-dates-row">
          <div className="mb-date-block">
            <span className="mb-date-label">Check-in</span>
            <strong className="mb-date-value">{formatDate(booking.fromDate)}</strong>
          </div>
          <span className="mb-date-arrow" aria-hidden>→</span>
          <div className="mb-date-block">
            <span className="mb-date-label">Check-out</span>
            <strong className="mb-date-value">{formatDate(booking.toDate)}</strong>
          </div>
          <div className="mb-date-block mb-date-block--nights">
            <span className="mb-date-label">Duration</span>
            <strong className="mb-date-value">
              {nights} {nights === 1 ? "night" : "nights"}
            </strong>
          </div>
        </div>

        <div className="mb-card-actions">
          <Link to={ROOM_ROUTES[booking.roomType]} className="mb-btn-outline">
            View room
          </Link>
          {canCancel && (
            <button type="button" className="mb-btn-cancel">
              Cancel booking
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function MyBookingsContent({ user }) {
  const [activeTab, setActiveTab] = useState("All");
  const filtered = filterBookings(MOCK_BOOKINGS, activeTab);

  return (
    <main className="mb-main">
      <div className="mb-layout">
        <section className="mb-section">
          <div className="mb-intro">
            <h1 className="mb-title">My Bookings</h1>
          </div>

          <div className="mb-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`mb-tab${activeTab === tab ? " mb-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mb-empty">
              <p className="mb-empty-icon">🛎️</p>
              <p className="mb-empty-text">No {activeTab.toLowerCase()} bookings found.</p>
              <Link to="/" className="join-primary-btn mb-empty-btn">
                Book a stay
              </Link>
            </div>
          ) : (
            <div className="mb-list">
              {filtered.map((b) => (
                <BookingCard key={b.bookingId} booking={b} />
              ))}
            </div>
          )}
        </section>

        <aside className="mb-aside">
          <div className="mb-aside-inner">
            <p className="mb-aside-cursive">Plan ahead</p>
            <h2 className="mb-aside-title">Book another stay</h2>
            <p className="mb-aside-text">
              Explore our rooms and find your next perfect getaway at the hotel.
            </p>
            <Link to="/" className="mb-aside-btn">Explore rooms</Link>
            <Link to="/profile" className="mb-aside-btn mb-aside-btn--alt">My profile</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function MyBookings() {
  const { user } = useAuth();

  return (
    <div className="mb-page">
      <TopBar />
      <Header />
      <MyBookingsContent user={user} />
    </div>
  );
}
