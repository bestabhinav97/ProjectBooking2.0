import { Link } from "react-router-dom";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import superiorRoom from "../assets/superior-room.jpg";

function SuperiorRoom() {
  return (
    <>
      <TopBar />
      <Header />

      <main className="room-detail-page">
        <section className="room-detail-title">
          <h1>Superior Room</h1>
        </section>

        <section className="room-detail-section">
          <div className="room-detail-layout">
            <div className="room-detail-image">
              <img src={superiorRoom} alt="Superior Room" />
            </div>

            <div className="room-detail-text">
              <p>
                Our superior room is a spacious and elegant room with premium
                comfort, modern details, and everything needed for a relaxing
                stay.
              </p>

              <p>
                The room is suitable for guests who want more space and comfort,
                while still keeping a clean and calm hotel feeling.
              </p>

              <Link to="/rooms" className="back-overview">
                Back to overview &gt;&gt;&gt;
              </Link>
            </div>

            <div className="room-detail-info">
              <ul>
                <li>1-2 persons</li>
                <li>Spacious room</li>
                <li>Double bed</li>
                <li>Armchair & desk</li>
                <li>Safety box</li>
                <li>TV</li>
                <li>Hairdryer</li>
                <li>Free Wi-Fi</li>
              </ul>

              <Link to="/" className="room-book-button">
                Book
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default SuperiorRoom;