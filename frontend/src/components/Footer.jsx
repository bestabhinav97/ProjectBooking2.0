import cashfree from "../assets/cashfree.jpg";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      {/* Left */}
      <div className="footer-left">

        <h2>Hotel Aurora</h2>

        <p>
          Södra Blasieholmshamnen 2, 111 48 Stockholm
        </p>

        <p>
          Tel: +46 431 57 33 44
        </p>

        <p>
          Email: info@hotelaurora.se
        </p>

        <div className="footer-company">
          <p>Hotel Aurora AB</p>
          <p>556232-8899</p>
        </div>

      </div>

      {/* Middle */}
      <div className="footer-middle">

        <Link to="/packages-offers">Packages & Offers</Link>
        <Link to="/rooms">Rooms</Link>
        <Link to="/meetings-events">Meetings & Events</Link>
        <Link to="/wellness">Wellness</Link>
        <Link to="/restaurant-bar">Restaurant & Bar</Link>
        <Link to="/about">About Us</Link>

      </div>

      {/* Right */}
      <div className="footer-right">

        <img
          src={cashfree}
          alt="Cash free hotel"
        />

      </div>

    </footer>
  );
}

export default Footer;