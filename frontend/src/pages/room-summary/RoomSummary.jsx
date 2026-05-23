import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust path to your setup

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Track payment redirection execution

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          fontFamily: "'Inter', sans-serif",
          color: "#2b2b2b",
        }}
      >
        <p
          style={{
            letterSpacing: "1px",
            fontSize: "13px",
            textTransform: "uppercase",
          }}
        >
          Loading your checkout experience...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 20px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h2
          style={{ fontWeight: "300", color: "#1c1c1c", marginBottom: "20px" }}
        >
          Please sign in to complete your booking
        </h2>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "14px 28px",
            background: "#1c1c1c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 20px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h2
          style={{ fontWeight: "300", color: "#1c1c1c", marginBottom: "20px" }}
        >
          No room configurations found
        </h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "14px 28px",
            background: "#1c1c1c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          Return to Selection
        </button>
      </div>
    );
  }

  const memberPrice = Math.round(room.pricePerNight * 0.9);

  const nights = (() => {
    try {
      if (!fromDate || !toDate) return 1;
      const d1 = new Date(fromDate);
      const d2 = new Date(toDate);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch (e) {
      return 1;
    }
  })();

  const totalPrice = Math.round((room.pricePerNight || 0) * nights);

  // API Call to initiate transaction secure backend reservation
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    // Filter valid companion details if applicable (can be saved to database dynamically or sent as metadata)
    const additionalGuestsString = extraGuests
      .filter((g) => g.trim() !== "")
      .join(", ");

    // Prepare payload structured strictly matching your backend controller parsing rules
    const bookingPayload = {
      roomNumber: room.roomNumber, // Matches your controller: const { roomNumber } = req.body;
      fromDate: fromDate, // Format expected: YYYY-MM-DD
      toDate: toDate, // Format expected: YYYY-MM-DD
      additionalGuests: additionalGuestsString, // Optional extension fields
    };

    try {
      // Replace URL with your correct backend target API environment address
      const response = await fetch("http://localhost:3000/bookings/initiate", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pass authorization token if using JWT middleware setup
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect browser directly to Stripe Checkout hosted checkout application
        window.location.href = data.url;
      } else {
        // Handle gracefully custom database logic errors (e.g., room already taken or date exceptions)
        alert(
          data.message ||
            "Reservation could not be initialized. Please try another period.",
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Payment integration error:", error);
      alert(
        "Network connectivity issue. Please confirm settings and try again.",
      );
      setIsSubmitting(false);
    }
  };

  const styles = {
    pageWrapper: {
      maxWidth: "1140px",
      margin: "0 auto",
      padding: "60px 20px",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      color: "#2b2b2b",
      backgroundColor: "#fcfcfc",
    },
    header: {
      fontSize: "36px",
      fontWeight: "300",
      letterSpacing: "-0.5px",
      marginBottom: "50px",
      color: "#1c1c1c",
    },
    splitLayout: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: "70px",
      alignItems: "start",
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "45px",
    },
    rightColumn: {
      position: "sticky",
      top: "40px",
      backgroundColor: "#ffffff",
      padding: "35px",
      borderRadius: "0px",
      border: "1px solid #ededed",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      letterSpacing: "1px",
      marginBottom: "25px",
      textTransform: "uppercase",
      color: "#1c1c1c",
      borderBottom: "1px solid #1c1c1c",
      paddingBottom: "10px",
    },
    imageContainer: {
      width: "100%",
      height: "300px",
      overflow: "hidden",
      marginBottom: "25px",
      backgroundColor: "#f0f0f0",
    },
    roomImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    inputField: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "15px",
      border: "1px solid #cccccc",
      borderRadius: "0px",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
      outline: "none",
      fontFamily: "inherit",
      transition: "border-color 0.2s ease",
    },
    textMuted: {
      color: "#666666",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    priceRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "10px 0",
    },
    primaryBtn: {
      width: "100%",
      padding: "18px",
      background: isSubmitting ? "#767676" : "#1c1c1c",
      color: "#ffffff",
      border: "none",
      fontWeight: "600",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      fontSize: "13px",
      cursor: isSubmitting ? "not-allowed" : "pointer",
      marginTop: "30px",
      transition: "background 0.2s ease",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.header}>Review your reservation</h1>

      <div style={styles.splitLayout}>
        <div style={styles.leftColumn}>
          <div>
            <h2 style={styles.sectionTitle}>1. Guest Contact</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "25px",
                marginTop: "15px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: "#767676",
                    display: "block",
                    marginBottom: "6px",
                    letterSpacing: "0.5px",
                  }}
                >
                  Username Profile
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#1c1c1c",
                  }}
                >
                  {user.username || "Authenticated User"}
                </p>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: "#767676",
                    display: "block",
                    marginBottom: "6px",
                    letterSpacing: "0.5px",
                  }}
                >
                  Email Address
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#1c1c1c",
                  }}
                >
                  {user.email || "N/A"}
                </p>
              </div>
            </div>
            <p
              style={{
                ...styles.textMuted,
                marginTop: "20px",
                fontSize: "13px",
                fontStyle: "italic",
                color: "#8c8c8c",
              }}
            >
              * Your digital mobile key access and room receipt statements will
              be directed to this secure log.
            </p>
          </div>

          {additionalGuestsCount > 0 && (
            <div>
              <h2 style={styles.sectionTitle}>2. Accompanying Guests</h2>
              <p style={{ ...styles.textMuted, marginBottom: "25px" }}>
                Your search specified a total of {totalGuests} guests. Please
                declare the names of the individuals sharing your allocated
                layout:
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {extraGuests.map((guestName, index) => (
                  <div key={index}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        fontWeight: "600",
                        color: "#444",
                      }}
                    >
                      Full Name — Companion #{index + 1}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Axel Wallin"
                      value={guestName}
                      onChange={(e) =>
                        handleGuestNameChange(index, e.target.value)
                      }
                      style={styles.inputField}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.imageContainer}>
            <img
              src={
                room.image_url
                  ? `http://localhost:3000${room.image_url}`
                  : "/placeholder-image.jpg"
              }
              alt={room.type}
              style={styles.roomImage}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "300",
                margin: "0 0 5px 0",
                color: "#1c1c1c",
                letterSpacing: "-0.5px",
              }}
            >
              {room.type.toUpperCase()} ROOM
            </h3>
            <span
              style={{
                fontSize: "11px",
                color: "#767676",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "500",
              }}
            >
              Room Allocation #{room.roomNumber}
            </span>

            <div
              style={{
                marginTop: "8px",
                padding: "12px",
                background: "#fbfbfb",
                border: "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "13px" }}>Dates</strong>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  {fromDate && toDate
                    ? new Date(fromDate).toLocaleDateString() +
                      " — " +
                      new Date(toDate).toLocaleDateString()
                    : "Not specified"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <strong style={{ fontSize: "13px" }}>Guests</strong>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  {totalGuests}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <strong style={{ fontSize: "13px" }}>Nights</strong>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  {nights}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "12px",
                }}
              >
                <strong style={{ fontSize: "13px" }}>Total</strong>
                <span style={{ fontSize: "15px", fontWeight: "600" }}>
                  €{totalPrice}
                </span>
              </div>
            </div>
          </div>

          <p
            style={{
              ...styles.textMuted,
              fontSize: "14px",
              margin: "20px 0",
              color: "#555",
            }}
          >
            {room.description ||
              "Thoughtfully curated with organic Nordic wood craftsmanship, sustainable wool textiles, and clean architectural lighting profiles."}
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              fontSize: "13px",
              color: "#666",
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: "20px",
              marginBottom: "20px",
            }}
          >
            <span>🛌 {room.noOfBeds} Beds</span> ·{" "}
            <span>📶 High-Speed Wi-Fi</span> · <span>☕ Climate Control</span>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div style={styles.priceRow}>
              <span style={styles.textMuted}>Standard Rate</span>
              <span
                style={{
                  color: "#8c8c8c",
                  textDecoration: "line-through",
                  fontSize: "15px",
                }}
              >
                €{room.pricePerNight}
              </span>
            </div>

            <div
              style={{
                ...styles.priceRow,
                borderTop: "1px solid #f0f0f0",
                paddingTop: "20px",
                marginTop: "15px",
              }}
            >
              <span
                style={{
                  fontWeight: "600",
                  color: "#1c1c1c",
                  fontSize: "15px",
                }}
              >
                Total Stay Rate
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "300",
                  color: "#1c1c1c",
                  lineHeight: "1",
                }}
              >
                €{memberPrice}
                <small
                  style={{
                    fontSize: "13px",
                    color: "#767676",
                    fontWeight: "400",
                    marginLeft: "2px",
                  }}
                >
                  / night
                </small>
              </span>
            </div>
          </div>

          <button
            style={styles.primaryBtn}
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing Transaction..."
              : "Complete Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomSummary;
