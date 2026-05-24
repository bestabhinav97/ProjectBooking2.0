import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../config/api";
import "../../styles/room-summary.css";

function formatDate(dateString) {
  if (!dateString) return "";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const [year, month, day] = dateString.split("-");
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
}

function RoomSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const room = location.state?.room;
  const totalGuests = location.state?.totalGuests || 1;
  const fromDate = location.state?.fromDate || null;
  const toDate = location.state?.toDate || null;

  const additionalGuestsCount = Math.max(0, totalGuests - 1);
  const [extraGuests, setExtraGuests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setExtraGuests(Array(additionalGuestsCount).fill(""));
  }, [additionalGuestsCount]);

  const handleGuestNameChange = (index, value) => {
    const updatedGuests = [...extraGuests];
    updatedGuests[index] = value;
    setExtraGuests(updatedGuests);
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <Header />
        <main className="summary-page summary-state-page">
          <div className="summary-state-card">
            <p className="summary-state-label">Loading your reservation…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <TopBar />
        <Header />
        <main className="summary-page summary-state-page">
          <div className="summary-state-card">
            <h2 className="summary-state-title">
              Please sign in to complete your booking
            </h2>
            <button
              type="button"
              className="summary-primary-btn"
              onClick={() => navigate("/login")}
            >
              Go to login
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!room) {
    return (
      <>
        <TopBar />
        <Header />
        <main className="summary-page summary-state-page">
          <div className="summary-state-card">
            <h2 className="summary-state-title">No room selected</h2>
            <button
              type="button"
              className="summary-primary-btn"
              onClick={() => navigate(-1)}
            >
              Return to selection
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const nights = (() => {
    if (!fromDate || !toDate) return 1;
    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  })();

  const pricePerNight = Number(room.pricePerNight) || 0;
  const totalPrice = Math.round(pricePerNight * nights);

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    const additionalGuestsString = extraGuests
      .filter((g) => g.trim() !== "")
      .join(", ");

    const bookingPayload = {
      roomNumber: room.roomNumber,
      fromDate,
      toDate,
      additionalGuests: additionalGuestsString,
    };

    try {
      const response = await fetch(`${API_BASE}/bookings/initiate`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(
          data.message ||
            "Reservation could not be initialized. Please try another period.",
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Payment integration error:", error);
      alert("Network connectivity issue. Please confirm settings and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopBar />
      <Header />

      <main className="summary-page">
        <section className="summary-hero">
          <p className="summary-eyebrow">Booking</p>
          <h1>Review your reservation</h1>
          <p className="summary-hero-subtitle">
            Confirm your details below and continue securely to payment.
          </p>
        </section>

        <section className="summary-content">
          <div className="summary-layout">
            <div className="summary-left">
              <article className="summary-card">
                <header className="summary-card-header">
                  <span className="summary-step">01</span>
                  <h2>Guest contact</h2>
                </header>

                <div className="summary-guest-grid">
                  <div className="summary-guest-field">
                    <span className="summary-field-label">Name</span>
                    <p className="summary-field-value">
                      {[user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                        user.username ||
                        "Authenticated guest"}
                    </p>
                  </div>

                  <div className="summary-guest-field">
                    <span className="summary-field-label">Email</span>
                    <p className="summary-field-value">{user.email || "—"}</p>
                  </div>
                </div>

                <p className="summary-note">
                  Your digital key and receipt will be sent to this email.
                </p>
              </article>

              {additionalGuestsCount > 0 && (
                <article className="summary-card">
                  <header className="summary-card-header">
                    <span className="summary-step">02</span>
                    <h2>Accompanying guests</h2>
                  </header>

                  <p className="summary-note summary-note--top">
                    Your search included {totalGuests} guests. Please list the
                    names of those sharing your room.
                  </p>

                  <div className="summary-companion-list">
                    {extraGuests.map((guestName, index) => (
                      <div key={index} className="summary-companion-field">
                        <label
                          htmlFor={`companion-${index}`}
                          className="summary-field-label"
                        >
                          Full name — Companion #{index + 1}
                        </label>
                        <input
                          id={`companion-${index}`}
                          type="text"
                          placeholder="e.g. Axel Wallin"
                          value={guestName}
                          onChange={(e) =>
                            handleGuestNameChange(index, e.target.value)
                          }
                          className="summary-input"
                        />
                      </div>
                    ))}
                  </div>
                </article>
              )}

              <article className="summary-card summary-card--policy">
                <header className="summary-card-header">
                  <span className="summary-step">
                    {additionalGuestsCount > 0 ? "03" : "02"}
                  </span>
                  <h2>Cancellation policy</h2>
                </header>

                <ul className="summary-policy-list">
                  <li>Free cancellation up to 24 hours before check-in.</li>
                  <li>Check-in from 15:00. Check-out before 11:00.</li>
                  <li>Payment processed securely via Stripe.</li>
                </ul>
              </article>
            </div>

            <aside className="summary-right">
              <div className="summary-room-card">
                <div className="summary-room-image">
                  <img
                    src={
                      room.image_url
                        ? `${API_BASE}${room.image_url}`
                        : "/placeholder-image.jpg"
                    }
                    alt={room.type}
                  />
                </div>

                <div className="summary-room-body">
                  <p className="summary-room-eyebrow">
                    Room {room.roomNumber}
                  </p>
                  <h3 className="summary-room-title">
                    {room.type
                      ? `${room.type.charAt(0).toUpperCase()}${room.type.slice(1)} room`
                      : "Room"}
                  </h3>

                  <p className="summary-room-description">
                    {room.description ||
                      "Thoughtfully designed with Nordic craftsmanship, organic textiles and clean architectural lighting."}
                  </p>

                  <ul className="summary-room-meta">
                    <li>
                      <span>Check-in</span>
                      <strong>{formatDate(fromDate)}</strong>
                    </li>
                    <li>
                      <span>Check-out</span>
                      <strong>{formatDate(toDate)}</strong>
                    </li>
                    <li>
                      <span>Guests</span>
                      <strong>{totalGuests}</strong>
                    </li>
                    <li>
                      <span>Nights</span>
                      <strong>{nights}</strong>
                    </li>
                    <li>
                      <span>Beds</span>
                      <strong>{room.noOfBeds}</strong>
                    </li>
                  </ul>

                  <div className="summary-price-block">
                    <div className="summary-price-row">
                      <span>
                        SEK {pricePerNight.toLocaleString("sv-SE")} × {nights}{" "}
                        night{nights > 1 ? "s" : ""}
                      </span>
                      <span>
                        SEK {totalPrice.toLocaleString("sv-SE")}
                      </span>
                    </div>

                    <div className="summary-price-row summary-price-row--total">
                      <span>Total</span>
                      <strong>
                        SEK {totalPrice.toLocaleString("sv-SE")}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="summary-primary-btn"
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing…" : "Complete reservation"}
                  </button>

                  <p className="summary-secure">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default RoomSummary;
