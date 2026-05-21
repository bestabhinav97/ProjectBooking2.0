import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    setLoading(false);
    const timer = setTimeout(() => navigate("/my-bookings"), 4000);
    return () => clearTimeout(timer);
  }, [sessionId]);

  const styles = {
    wrapper: {
      maxWidth: "800px",
      margin: "60px auto",
      padding: "0 20px",
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      color: "#2B2B2B",
    },
    heroCard: {
      backgroundColor: "#FFF8F8", // Soft warm tint
      borderTop: "5px solid #D9232A", // Scandic Red Signature Brand line
      padding: "40px",
      textAlign: "center",
      marginBottom: "30px",
      boxShadow: "0 4px 15px rgba(217, 35, 42, 0.05)",
    },
    successIcon: {
      fontSize: "36px",
      color: "#D9232A",
      marginBottom: "10px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "300",
      color: "#1C1C1C",
      margin: "10px 0",
      letterSpacing: "-0.5px",
    },
    subtitle: {
      color: "#555",
      fontSize: "15px",
      margin: "0 0 5px 0",
    },
    orderRef: {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#888",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "30px",
      marginTop: "30px",
    },
    card: {
      border: "1px solid #EAEAEA",
      padding: "25px",
      backgroundColor: "#FFF",
    },
    cardTitle: {
      fontSize: "14px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#D9232A", // Scandic Red Title
      borderBottom: "1px solid #EAEAEA",
      paddingBottom: "12px",
      margin: "0 0 15px 0",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      fontSize: "14px",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 0 0 0",
      marginTop: "10px",
      borderTop: "2px solid #D9232A",
      fontWeight: "700",
      fontSize: "18px",
    },
    infoBlock: {
      fontSize: "14px",
      lineHeight: "1.6",
      color: "#555",
    },
    primaryBtn: {
      backgroundColor: "#D9232A", // Scandic Red CTA Button
      color: "#FFF",
      padding: "16px 32px",
      border: "none",
      fontWeight: "600",
      letterSpacing: "1px",
      textTransform: "uppercase",
      fontSize: "13px",
      cursor: "pointer",
      marginTop: "40px",
      width: "100%",
      transition: "background-color 0.2s ease",
    },
  };

  if (loading) {
    return (
      <div
        style={{ ...styles.wrapper, textAlign: "center", padding: "100px 0" }}
      >
        <p
          style={{
            letterSpacing: "1px",
            fontSize: "14px",
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          Verifying secure transaction statements...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.heroCard}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.title}>We look forward to welcoming you</h1>
        <p style={styles.subtitle}>
          Your reservation is complete. A confirmation voucher has been sent to
          your email.
        </p>
        {sessionId && (
          <span style={styles.orderRef}>
            Booking Ref: {sessionId.substring(0, 16)}...
          </span>
        )}
      </div>

      <div style={styles.detailsGrid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Stay Summary</h2>
          {sessionData ? (
            <>
              <div style={styles.row}>
                <span style={{ color: "#666" }}>Accommodation Allocation</span>
                <strong style={{ color: "#1c1c1c" }}>
                  {sessionData.line_items?.[0]?.price_data?.product_data?.name}
                </strong>
              </div>
              <div style={styles.row}>
                <span style={{ color: "#666" }}>Duration Window</span>
                <span style={{ color: "#1c1c1c" }}>
                  {
                    sessionData.line_items?.[0]?.price_data?.product_data
                      ?.description
                  }
                </span>
              </div>
              <div style={styles.row}>
                <span style={{ color: "#666" }}>Payment Status</span>
                <span style={{ color: "#2e7d32", fontWeight: "600" }}>
                  Secured & Processed
                </span>
              </div>
              <div style={styles.totalRow}>
                <span>Total Amount Charged</span>
                <span>
                  {(sessionData.amount_total / 100).toLocaleString()} SEK
                </span>
              </div>
            </>
          ) : (
            <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>
              Your transaction processed flawlessly. Please present your digital
              ID or confirmation reference at the front terminal upon arrival.
            </p>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Arrival Guidelines</h2>
          <div style={styles.infoBlock}>
            <p style={{ margin: "0 0 12px 0" }}>
              🏨 <strong>Check-In Timeline:</strong> Your room access activates
              dynamically at <strong>15:00</strong> on your day of arrival.
            </p>
            <p style={{ margin: 0 }}>
              🔑 <strong>Mobile Smart Key:</strong> Use the Scandic application
              profile to unlock room doors directly via secure Bluetooth
              protocols.
            </p>
          </div>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginTop: "20px" }}>
        Redirecting to your bookings in a few seconds...
      </p>
      <button
        style={styles.primaryBtn}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#B81920")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#D9232A")}
        onClick={() => navigate("/my-bookings")}
      >
        View My Bookings
      </button>
    </div>
  );
}

export default BookingSuccess;
