import React from "react";
import { useNavigate } from "react-router-dom";

function BookingFailed() {
  const navigate = useNavigate();

  const styles = {
    wrapper: {
      maxWidth: "550px",
      margin: "100px auto",
      padding: "0 20px",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      textAlign: "center",
    },
    errorIcon: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      backgroundColor: "#FFF0F0", // Warm light red background
      color: "#D9232A", // Scandic Red icon text
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "26px",
      fontWeight: "300",
      margin: "0 auto 24px auto",
      border: "1px solid #FCD2D4",
    },
    title: {
      fontSize: "28px",
      fontWeight: "300",
      color: "#1c1c1c",
      margin: "0 0 15px 0",
      letterSpacing: "-0.5px",
    },
    text: {
      fontSize: "14px",
      color: "#666",
      lineHeight: "1.6",
      margin: "0 0 35px 0",
    },
    buttonGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    primaryBtn: {
      backgroundColor: "#D9232A", // Scandic Red main CTA
      color: "#FFF",
      padding: "16px",
      border: "none",
      fontWeight: "600",
      letterSpacing: "1px",
      textTransform: "uppercase",
      fontSize: "13px",
      cursor: "pointer",
      width: "100%",
    },
    secondaryBtn: {
      backgroundColor: "transparent",
      color: "#1C1C1C",
      padding: "16px",
      border: "1px solid #D9232A", // Scandic Red outline border
      fontWeight: "600",
      letterSpacing: "1px",
      textTransform: "uppercase",
      fontSize: "13px",
      cursor: "pointer",
      width: "100%",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.errorIcon}>✕</div>
      <h1 style={styles.title}>Booking Interrupted</h1>
      <p style={styles.text}>
        Your reservation attempt was not finalized. No charges were made to your
        card, and your selected stay configuration has been saved so you don't
        lose your choices.
      </p>

      <div style={styles.buttonGroup}>
        <button
          style={styles.primaryBtn}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#B81920")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#D9232A")}
          onClick={() => navigate(-1)}
        >
          Review Summary & Try Again
        </button>
        <button style={styles.secondaryBtn} onClick={() => navigate("/")}>
          Explore Other Alternatives
        </button>
      </div>
    </div>
  );
}

export default BookingFailed;
