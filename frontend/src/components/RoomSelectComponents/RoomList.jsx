import React from "react";
import RoomCard from "./RoomCard";
import "../../styles/RoomSelect/roomSelect.css";

const RoomList = ({ rooms = [], totalGuests, fromDate, toDate }) => {
  return (
    <div className="rooms-grid">
      {rooms.map((room) => (
        <RoomCard
          key={room.roomNumber}
          room={room}
          totalGuests={totalGuests}
          fromDate={fromDate}
          toDate={toDate}
        />
      ))}
    </div>
  );
};

export default RoomList;
