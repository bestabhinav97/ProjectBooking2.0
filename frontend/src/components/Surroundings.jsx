import beach from "../assets/beach.jpg";
import { Link } from "react-router-dom";

function Surroundings() {
  return (
    <Link
      to="/surroundings"
      className="surroundings-link"
    >
      <section
        className="surroundings"
        style={{ backgroundImage: `url(${beach})` }}
      >
        <div className="surroundings-content">
          <h2>EXPLORE THE SURROUNDINGS</h2>
        </div>
      </section>
    </Link>
  );
}

export default Surroundings;