import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/packages-offers">Packages & Offers</Link>
        </li>

        <li>
          <Link to="/rooms">Rooms</Link>
        </li>

        <li>
          <Link to="/meetings-events">Meetings & Events</Link>
        </li>

        <li>
          <Link to="/wellness">Wellness</Link>
        </li>

        <li className="has-dropdown">
          <Link to="/restaurant-bar" className="has-arrow">
            Restaurant & Bar
          </Link>

          <ul className="dropdown">
            <li>
              <Link to="/restaurant-bar#breakfast">Breakfast</Link>
            </li>
            <li>
              <Link to="/restaurant-bar#lunch">Lunch</Link>
            </li>
            <li>
              <Link to="/restaurant-bar#dinner">Dinner</Link>
            </li>
            <li>
              <Link to="/restaurant-bar#party">After Work Party</Link>
            </li>
          </ul>
        </li>

        <li className="has-dropdown">
          <Link to="/about" className="has-arrow">
            About Us
          </Link>

          <ul className="dropdown">
            <li>
              <Link to="/about#contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/about#find">Find Us</Link>
            </li>
            <li>
              <Link to="/about#company">Company Information</Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
