import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/api";

const RoomCard = ({ room, totalGuests, fromDate, toDate }) => {
  if (!room) return null;

  const isAvailable = room.status === "available";
  const navigate = useNavigate();

  function handleBook() {
    if (!isAvailable) return;

    navigate("/booking/summary", {
      state: {
        room: room,
        totalGuests: totalGuests,
        fromDate: fromDate,
        toDate: toDate,
      },
    });
  }

  return (
    <div className="hotel-card">
      <div className="card-image">
        <img
          src={
            room.image_url
              ? `${API_BASE}${room.image_url}`
              : "/placeholder-image.jpg"
          }
          alt={`Room ${room.roomNumber}`}
        />
        <div className="card-badge">{room.status}</div>
      </div>

      <div className="card-info">
        <h2 className="hotel-name">{room.type.toUpperCase()} room</h2>
        <p className="location-text">0.2 km to city center</p>

        <p className="description">
          {room.description ||
            "A beautiful, modern room equipped with premium amenities, perfect for your stay."}
        </p>

        <div className="amenities">
          <span>🛌 {room.noOfBeds} Beds</span>
          <span>📶 Free Wi-Fi</span>
          <span>☕ AC Included</span>
        </div>
      </div>

      <div className="card-pricing">
        <div className="price-container">
          <div className="price-box standard">
            <span className="price-label">Standard price</span>
            <span className="price-amount">
              {room.pricePerNight} SEK
              <small>/night</small>
            </span>
          </div>

          <div className="price-box member">
            <span className="price-label member-label">Member price</span>
            <span className="price-amount member-amount">
              {Math.round(room.pricePerNight * 0.9)} SEK
              <small>/night</small>
            </span>
          </div>
        </div>

        <button
          className="select-btn"
          disabled={!isAvailable}
          onClick={handleBook}
        >
          {isAvailable ? "BOOK" : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;