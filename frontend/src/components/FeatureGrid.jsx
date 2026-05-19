import { Link } from "react-router-dom";

import meetings from "../assets/meetings.jpg";
import offers from "../assets/offers.jpg";
import restaurant from "../assets/restaurant.jpg";
import spa from "../assets/spa.jpg";

function FeatureGrid() {
  return (
    <section className="feature-grid-section">
      <div className="feature-grid">
        <div className="feature-card">
          <img src={meetings} alt="" />

          <h3>Meetings & Events</h3>

          <p>Plan meetings and events in a modern setting.</p>

          <Link to="/meetings-events">
            <button>FIND OUT MORE</button>
          </Link>
        </div>

        <div className="feature-card">
          <img src={offers} alt="" />

          <h3>Special Offers</h3>

          <p>Discover our latest deals and packages.</p>

          <Link to="/packages-offers">
            <button>FIND OUT MORE</button>
          </Link>
        </div>

        <div className="feature-card">
          <img src={restaurant} alt="" />

          <h3>Restaurant & Bar</h3>

          <p>Enjoy great food and drinks in a relaxed atmosphere.</p>

          <button>FIND OUT MORE</button>
        </div>

        <div className="feature-card">
          <img src={spa} alt="" />

          <h3>Spa</h3>

          <p>Relax and recharge with our spa experiences.</p>

          <Link to="/wellness">
            <button>FIND OUT MORE</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeatureGrid;