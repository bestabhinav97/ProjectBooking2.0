import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BookingBox() {
  const [dateOpen, setDateOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  const [checkIn, setCheckIn] = useState(6);
  const [checkOut, setCheckOut] = useState(7);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const navigate = useNavigate();

  function handleDateClick(day) {
    if (!checkIn || checkOut) {
      setCheckIn(day);
      setCheckOut(null);
    } else {
      if (day > checkIn) {
        setCheckOut(day);
      } else {
        setCheckIn(day);
      }
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
              ? `${checkIn} May - ${checkOut} May`
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

        <button
          className="book-button"
          onClick={() => navigate("/booking")}
        >
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
            <div className="month-block">
              <h2>May 2026</h2>

              <div className="calendar-grid">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>

                <span></span>
                <span></span>
                <span></span>
                <span></span>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={
                      day === checkIn || day === checkOut
                        ? "selected-date"
                        : ""
                    }
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="month-block">
              <h2>June 2026</h2>

              <div className="calendar-grid">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day) => (
                  <button key={day}>{day}</button>
                ))}
              </div>
            </div>
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