import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import JoinNow from "./pages/JoinNow";
import Booking from "./pages/Booking";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/joinnow" element={<JoinNow />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
