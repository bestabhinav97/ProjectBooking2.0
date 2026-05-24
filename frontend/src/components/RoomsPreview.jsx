import { useState } from "react";
import { Link } from "react-router-dom";

import singleRoom from "../assets/single-room.jpg";
import superiorRoom from "../assets/superior-room.jpg";
import suiteRoom from "../assets/suite-room.jpg";

function RoomsPreview() {

  const rooms = [
    {
      image: singleRoom,
      title: "SINGLE ROOM",
    },
    {
      image: superiorRoom,
      title: "SUPERIOR ROOM",
    },
    {
      image: suiteRoom,
      title: "SUITE",
    },
  ];

  const [current, setCurrent] = useState(0);

  function nextSlide(event) {
    event.stopPropagation();

    setCurrent((prev) => (prev + 1) % rooms.length);
  }

  function prevSlide(event) {
    event.stopPropagation();

    setCurrent((prev) =>
      prev === 0 ? rooms.length - 1 : prev - 1
    );
  }

  return (
    <section className="rooms-slider">

      <Link
        to="/rooms"
        className="rooms-slider-link"
      >

        <img
          src={rooms[current].image}
          alt={rooms[current].title}
        />

        <div className="rooms-overlay"></div>

        <h2>OUR ROOMS</h2>

      </Link>

      <button
        className="slider-btn slider-left"
        onClick={prevSlide}
      >
        ‹
      </button>

      <button
        className="slider-btn slider-right"
        onClick={nextSlide}
      >
        ›
      </button>

    </section>
  );
}

export default RoomsPreview;