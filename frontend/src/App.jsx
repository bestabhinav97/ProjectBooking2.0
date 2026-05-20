import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import JoinNow from "./pages/JoinNow";
import Booking from "./pages/Booking";
import PackagesOffers from "./pages/PackagesOffers";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/SingleRoom";
import SuperiorRoom from "./pages/SuperiorRoom";
import RoomSelect from "./pages/RoomSelect/RoomSelect";
import SuiteRoom from "./pages/SuiteRoom";
import MeetingsEvents from "./pages/MeetingsEvents";
import Wellness from "./pages/Wellness";
import AdminTest from "./pages/AdminTest";
import RoomSummary from "./pages/RoomSummary/RoomSummary";
import BookingSuccess from "./pages/RoomSummary/BookingSuccess";
import BookingFailed from "./pages/RoomSummary/BookingFailed";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/joinnow" element={<JoinNow />} />
          <Route path="/roomSelect" element={<RoomSelect />} />
          <Route path="/packages-offers" element={<PackagesOffers />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/single" element={<SingleRoom />} />
          <Route path="/rooms/superior" element={<SuperiorRoom />} />
          <Route path="/rooms/suite" element={<SuiteRoom />} />
          <Route path="/meetings-events" element={<MeetingsEvents />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/admin-test" element={<AdminTest />} />
          <Route path="/booking/summary" element={<RoomSummary />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/booking-failed" element={<BookingFailed />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
