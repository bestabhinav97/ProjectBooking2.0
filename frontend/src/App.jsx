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
import RoomSelect from "./pages/room-select/RoomSelect";
import SuiteRoom from "./pages/SuiteRoom";
import MeetingsEvents from "./pages/MeetingsEvents";
import Wellness from "./pages/Wellness";
import AdminReservations from "./pages/AdminReservations";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRooms from "./pages/AdminRooms";
import RoomSummary from "./pages/room-summary/RoomSummary";
import BookingSuccess from "./pages/room-summary/BookingSuccess";
import BookingFailed from "./pages/room-summary/BookingFailed";
import MyBookings from "./pages/MyBookings";
import RestaurantBar from "./pages/RestaurantBar";
import AboutUs from "./pages/AboutUs";


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
          <Route path="/booking/summary" element={<RoomSummary />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/booking-failed" element={<BookingFailed />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/restaurant-bar" element={<RestaurantBar />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="rooms" element={<AdminRooms />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
