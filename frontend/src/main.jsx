import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/navbar.css";
import "./styles/booking.css";
import "./styles/home.css";
import "./styles/offers.css";
import "./styles/rooms.css";
import "./styles/meetings.css";
import "./styles/wellness.css";
import "./styles/footer.css";
import "./styles/login.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);