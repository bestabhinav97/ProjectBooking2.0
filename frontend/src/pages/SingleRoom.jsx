import { Link } from "react-router-dom";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import singleRoom from "../assets/single-room.jpg";

function SingleRoom() {
  return (
    <>
      <TopBar />
      <Header />

      <main className="room-detail-page">
        <section className="room-detail-title">
          <h1>Single Room</h1>
        </section>

        <section className="room-detail-section">
          <div className="room-detail-layout">
            <div className="room-detail-image">
              <img src={singleRoom} alt="Single Room" />
            </div>

            <div className="room-detail-text">
              <p>
                Less is more. Our smallest single rooms are perfect for guests
                who spend more time in the city and less time in the room.
              </p>

              <p>
                The room has everything needed for a comfortable hotel stay,
                including free Wi-Fi, TV, safety box, and a practical desk area.
              </p>

              <Link to="/rooms" className="back-overview">
                Back to overview &gt;&gt;&gt;
              </Link>
            </div>

            <div className="room-detail-info">
              <ul>
                <li>1 person</li>
                <li>Compact room</li>
                <li>Single bed</li>
                <li>Desk</li>
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

export default SingleRoom;