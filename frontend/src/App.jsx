import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import JoinNow from "./pages/JoinNow";
import PackagesOffers from "./pages/PackagesOffers";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/SingleRoom";
import SuperiorRoom from "./pages/SuperiorRoom";
import RoomSelect from "./pages/room-select/RoomSelect";
import SuiteRoom from "./pages/SuiteRoom";
import MeetingsEvents from "./pages/MeetingsEvents";
import Wellness from "./pages/Wellness";
import RoomSummary from "./pages/room-summary/RoomSummary";
import BookingSuccess from "./pages/room-summary/BookingSuccess";
import BookingFailed from "./pages/room-summary/BookingFailed";
import RestaurantBar from "./pages/RestaurantBar";
import AboutUs from "./pages/AboutUs";

import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPlaceholder from "./pages/AdminPlaceholder";

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

          <Route path="/packages-offers" element={<PackagesOffers />} />

          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/single" element={<SingleRoom />} />
          <Route path="/rooms/superior" element={<SuperiorRoom />} />
          <Route path="/rooms/suite" element={<SuiteRoom />} />
          <Route path="/roomSelect" element={<RoomSelect />} />

          <Route path="/meetings-events" element={<MeetingsEvents />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/restaurant-bar" element={<RestaurantBar />} />
          <Route path="/about" element={<AboutUs />} />

          <Route path="/booking/summary" element={<RoomSummary />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/booking-failed" element={<BookingFailed />} />

          <Route path="/admin-test" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path=":sectionName" element={<AdminPlaceholder />} />
          </Route>

          <Route path="/admin" element={<Navigate to="/admin-test" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;