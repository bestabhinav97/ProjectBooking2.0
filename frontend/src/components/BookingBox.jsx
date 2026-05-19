import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BookingBox() {
  const [dateOpen, setDateOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  const [checkIn, setCheckIn] = useState("2026-05-06");
  const [checkOut, setCheckOut] = useState("2026-05-07");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const navigate = useNavigate();

  const months = [
    { label: "May 2026", year: 2026, month: 5, days: 31, startOffset: 4 },
    { label: "June 2026", year: 2026, month: 6, days: 30, startOffset: 0 },
    { label: "July 2026", year: 2026, month: 7, days: 31, startOffset: 2 },
  ];

  function buildDateString(year, month, day) {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function formatDateLabel(dateString) {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    const monthNames = [
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

    return `${parseInt(day, 10)} ${monthNames[parseInt(month, 10) - 1]}`;
  }

  function handleDateClick(year, month, day) {
    const dateString = buildDateString(year, month, day);

    if (!checkIn || checkOut) {
      setCheckIn(dateString);
      setCheckOut(null);
    } else {
      if (new Date(dateString) > new Date(checkIn)) {
        setCheckOut(dateString);
      } else {
        setCheckIn(dateString);
      }
    }
  }

  // New async function to handle the API submission
  async function handleBookingSubmit() {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    const formattedCheckIn = checkIn;
    const formattedCheckOut = checkOut;

    const noOfBedsRequired = adults + children;

    const requestBody = {
      fromDate: formattedCheckIn,
      toDate: formattedCheckOut,
      noOfBedsRequired: noOfBedsRequired,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/rooms/getAvailableRoom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Keeps your working session cookie attached
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        // If it still fails, let's see what the backend error message says
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.statusText}`,
        );
      }
      const availableRoomsData = await response.json();
      // ✅ FIX: Extract the actual array from .data before navigating
      const roomsArray = availableRoomsData.data || [];
      console.log(roomsArray);

      // Pass the clean array and selected dates down to the next route
      navigate("/roomSelect", {
        state: {
          rooms: roomsArray,
          totalGuests: adults + children,
          fromDate: formattedCheckIn,
          toDate: formattedCheckOut,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      alert(`Failed to fetch rooms: ${error.message}`);
    }
  }

  return (
    <div className="booking-wrapper">
      <div className="booking-box">
        <button
          className="booking-large-field"
          onClick={() => {
            setDateOpen(!dateOpen);
            setGuestOpen(false);
          }}
        >
          <span className="material-symbols-outlined booking-material-icon">
            calendar_month
          </span>

          <span>
            {checkIn && checkOut
              ? `${formatDateLabel(checkIn)} - ${formatDateLabel(checkOut)}`
              : "Select dates"}
          </span>
        </button>

        <button
          className="booking-large-field"
          onClick={() => {
            setGuestOpen(!guestOpen);
            setDateOpen(false);
          }}
        >
          <span className="material-symbols-outlined booking-material-icon">
            group
          </span>

          <span>
            {adults} adult{adults > 1 ? "s" : ""}, {rooms} room
            {rooms > 1 ? "s" : ""}
          </span>
        </button>

        {/* Updated button to trigger the API call */}
        <button className="book-button" onClick={handleBookingSubmit}>
          Book
        </button>
      </div>

      {guestOpen && (
        <div className="guest-popup">
          <div className="guest-row">
            <div>
              <h3>Adults</h3>
              <p>Age 18+</p>
            </div>

            <div className="counter">
              <button onClick={() => setAdults(Math.max(1, adults - 1))}>
                -
              </button>
              <span>{adults}</span>
              <button onClick={() => setAdults(adults + 1)}>+</button>
            </div>
          </div>

          <div className="guest-row">
            <div>
              <h3>Children</h3>
              <p>Age 0-17</p>
            </div>

            <div className="counter">
              <button onClick={() => setChildren(Math.max(0, children - 1))}>
                -
              </button>
              <span>{children}</span>
              <button onClick={() => setChildren(children + 1)}>+</button>
            </div>
          </div>

          <div className="guest-row">
            <div>
              <h3>Rooms</h3>
              <p>Number of rooms</p>
            </div>

            <div className="counter">
              <button onClick={() => setRooms(Math.max(1, rooms - 1))}>
                -
              </button>
              <span>{rooms}</span>
              <button onClick={() => setRooms(rooms + 1)}>+</button>
            </div>
          </div>

          <button
            className="guest-done-button"
            onClick={() => setGuestOpen(false)}
          >
            Done
          </button>
        </div>
      )}

      {dateOpen && (
        <div className="date-popup">
          <div className="months-wrapper">
            {months.map((month) => (
              <div className="month-block" key={month.label}>
                <h2>{month.label}</h2>

                <div className="calendar-grid">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>

                  {Array.from({ length: month.startOffset }).map((_, index) => (
                    <span key={`${month.month}-empty-${index}`}></span>
                  ))}

                  {Array.from({ length: month.days }, (_, index) => {
                    const day = index + 1;
                    const dateString = buildDateString(
                      month.year,
                      month.month,
                      day,
                    );

                    return (
                      <button
                        key={dateString}
                        onClick={() =>
                          handleDateClick(month.year, month.month, day)
                        }
                        className={
                          dateString === checkIn || dateString === checkOut
                            ? "selected-date"
                            : ""
                        }
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            className="date-done-button"
            onClick={() => setDateOpen(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingBox;
