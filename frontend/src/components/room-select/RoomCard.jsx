import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room, totalGuests, fromDate, toDate }) => {
  if (!room) return null;

  const isAvailable = room.status === "available";
  const navigate = useNavigate();

  function handleBook() {
    if (!isAvailable) return;

    // Use the totalGuests prop passed from RoomSelect (already properly calculated)
    // Forward the room data, guest count, and selected dates to the summary page
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
      {/* 1. LEFT COLUMN: IMAGE */}
      <div className="card-image">
        <img
          src={
            room.image_url
              ? `http://localhost:3000${room.image_url}`
              : "/placeholder-image.jpg"
          }
          alt={`Room ${room.roomNumber}`}
        />
        <div className="card-badge">{room.status}</div>
      </div>

      {/* 2. MIDDLE COLUMN: DETAILS */}
      <div className="card-info">
        <h2 className="hotel-name">{room.type.toUpperCase()} room</h2>
        <p className="location-text">0.2 km to city center</p>

        <p className="description">
          {room.description ||
            "A beautiful, modern room equipped with premium amenities, perfect for your stay."}
        </p>

        {/* Amenity Icons / Badges */}
        <div className="amenities">
          <span>🛌 {room.noOfBeds} Beds</span>
          <span>📶 Free Wi-Fi</span>
          <span>☕ AC Included</span>
        </div>
      </div>

      {/* 3. RIGHT COLUMN: PRICING & ACTION */}
      <div className="card-pricing">
        <div className="price-container">
          <div className="price-box standard">
            <span className="price-label">Standard price</span>
            <span className="price-amount">
              €{room.pricePerNight}
              <small>/night</small>
            </span>
          </div>

          <div className="price-box member">
            <span className="price-label member-label">Member price</span>
            <span className="price-amount member-amount">
              €{Math.round(room.pricePerNight * 0.9)}
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
