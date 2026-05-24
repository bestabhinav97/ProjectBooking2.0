import { Link } from "react-router-dom";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

import suiteRoom from "../assets/suite-room.jpg";

function SuiteRoom() {
  return (
    <>
      <TopBar />
      <Header />

      <main className="room-detail-page">
        <section className="room-detail-title">
          <h1>Suite</h1>
        </section>

        <section className="room-detail-section">
          <div className="room-detail-layout">
            <div className="room-detail-image">
              <img src={suiteRoom} alt="Suite" />
            </div>

            <div className="room-detail-text">
              <p>
                Our suite is designed with comfort and leisure in mind. Here you
                enjoy generous space, a comfortable seating area, and a rooftop
                view over the city.
              </p>

              <p>
                The suite includes everything needed for a premium stay, from
                relaxing furniture to practical hotel amenities and free Wi-Fi.
              </p>

              <Link to="/rooms" className="back-overview">
                Back to overview &gt;&gt;&gt;
              </Link>
            </div>

            <div className="room-detail-info">
              <ul>
                <li>1-4 persons</li>
                <li>Large suite</li>
                <li>Rooftop view</li>
                <li>Bedroom</li>
                <li>Bed sofa</li>
                <li>Armchair & desk</li>
                <li>Safety box & TV</li>
                <li>Minibar</li>
                <li>Kettle, tea & coffee</li>
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

export default SuiteRoom;