import { Link } from "react-router-dom";

function SimpleHeader() {
  return (
    <header className="simple-header">
      <Link to="/" className="simple-back">
        <span>‹</span>
        Back to homepage
      </Link>

      <Link to="/" className="simple-logo">
        Hotel
      </Link>

      <div className="simple-empty"></div>
    </header>
  );
}

export default SimpleHeader;