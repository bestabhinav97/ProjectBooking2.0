import { Link } from "react-router-dom";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import singleRoom from "../assets/single-room.jpg";
import superiorRoom from "../assets/superior-room.jpg";
import suiteRoom from "../assets/suite-room.jpg";

function Rooms() {
  return (
    <>
      <TopBar />
      <Header />

      <main className="rooms-page">
        <section className="rooms-page-hero">
          <h1>Our Rooms</h1>
        </section>

        <section className="rooms-overview-grid">
          <article className="rooms-overview-card">
            <img src={singleRoom} alt="Single Room" />

            <div className="rooms-overview-content">
              <h2>Single room</h2>

              <p>
                Less is more. Our smallest single rooms are perfect for guests
                who spend more time in the city and less time in the room.
              </p>

              <Link to="/rooms/single">Read more</Link>
            </div>
          </article>

          <article className="rooms-overview-card">
            <img src={superiorRoom} alt="Superior Room" />

            <div className="rooms-overview-content">
              <h2>Superior room</h2>

              <p>
                A spacious and elegant room with premium comfort, modern details,
                and everything needed for a relaxing stay.
              </p>

              <Link to="/rooms/superior">Read more</Link>
            </div>
          </article>

          <article className="rooms-overview-card">
            <img src={suiteRoom} alt="Suite" />

            <div className="rooms-overview-content">
              <h2>Suite</h2>

              <p>
                Our suite offers generous space, a comfortable seating area,
                exclusive amenities, and a rooftop view over the city.
              </p>

              <Link to="/rooms/suite">Read more</Link>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Rooms;