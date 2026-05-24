import { useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ isOpen = false, onClose = () => {} }) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleNavigate = () => onClose();

  return (
    <nav className={`navbar${isOpen ? " navbar--open" : ""}`}>
      <ul className="nav-links">
        <li>
          <Link to="/packages-offers" onClick={handleNavigate}>
            Packages & Offers
          </Link>
        </li>

        <li>
          <Link to="/rooms" onClick={handleNavigate}>
            Rooms
          </Link>
        </li>

        <li>
          <Link to="/meetings-events" onClick={handleNavigate}>
            Meetings & Events
          </Link>
        </li>

        <li>
          <Link to="/wellness" onClick={handleNavigate}>
            Wellness
          </Link>
        </li>

        <li className="has-dropdown">
          <Link to="/restaurant-bar" onClick={handleNavigate}>
            Restaurant & Bar
          </Link>

          <ul className="dropdown">
            <li>
              <Link to="/restaurant-bar#breakfast" onClick={handleNavigate}>
                Breakfast
              </Link>
            </li>
            <li>
              <Link to="/restaurant-bar#lunch" onClick={handleNavigate}>
                Lunch
              </Link>
            </li>
            <li>
              <Link to="/restaurant-bar#dinner" onClick={handleNavigate}>
                Dinner
              </Link>
            </li>
            <li>
              <Link to="/restaurant-bar#party" onClick={handleNavigate}>
                After Work Party
              </Link>
            </li>
          </ul>
        </li>

        <li className="has-dropdown">
          <Link to="/about" onClick={handleNavigate}>
            About Us
          </Link>

          <ul className="dropdown">
            <li>
              <Link to="/about#contact" onClick={handleNavigate}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/about#find" onClick={handleNavigate}>
                Find Us
              </Link>
            </li>
            <li>
              <Link to="/about#company" onClick={handleNavigate}>
                Company Information
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
