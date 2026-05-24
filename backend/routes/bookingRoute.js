/**
 * ========== BOOKING ROUTES ==========
 * Routes for booking management (create, retrieve, cancel)
 * All routes require: authenticated user
 * Some routes also have: rate limiting middleware
 */

const express = require("express");
const bookingRouter = express.Router();
const bookingController = require("../controller/bookingController");
const authMiddleWear = require("../middlewear/AuthMiddlewear");

// ===== APPLY AUTHENTICATION MIDDLEWARE TO ALL ROUTES =====
// All booking routes require valid JWT token
bookingRouter.use(authMiddleWear.checkLogin);

/**
 * POST /bookings/initiate
 * Start a new booking (create pending booking, generate Stripe session)
 *
 * REQUIRES: JWT authentication + rate limiting (max 5 requests per 5 min)
 *
 * REQUEST BODY:
 *   - roomNumber: Room to book
 *   - fromDate: Check-in date (YYYY-MM-DD)
 *   - toDate: Check-out date (YYYY-MM-DD)
 *
 * RESPONSE: Stripe checkout session URL for payment
 *
 * RATE LIMITING: Prevents users from spamming booking requests
 * Max 5 booking attempts per user per 5-minute window
 */
bookingRouter.post("/initiate", bookingController.initiateBooking);

/**
 * GET /bookings/getBookings
 * Retrieve all pending and confirmed bookings for authenticated user
 *
 * REQUIRES: JWT authentication
 *
 * RESPONSE: Array of user's bookings with details (room, dates, status, cost)
 */
bookingRouter.get("/getBookings", bookingController.getUserBookings);
bookingRouter.get("/confirm-session/:sessionId", bookingController.confirmSession);

/**
 * GET /bookings/cancelBooking/:bookingId
 * Cancel a user's booking
 *
 * REQUIRES: JWT authentication
 * URL PARAMS: bookingId - ID of booking to cancel
 *
 * NOTE: Only user's own bookings can be cancelled (security check in controller)
 *
 * RESPONSE: Success/failure message
 */
bookingRouter.get(
  "/cancelBooking/:bookingId",
  bookingController.cancelUserBooking,
);

/**
 * =========================================================================
 * GET /bookings/admin/allBookings
 * Retrieve EVERY reservation in the database for the admin panel dashboard
 *
 * REQUIRES: JWT authentication AND Admin Role verification
 *
 * RESPONSE: Array of all customer bookings with joined user and room details
 * =========================================================================
 */
bookingRouter.get(
  "/admin/allBookings",
  authMiddleWear.isAdmin, // CRITICAL: Middleware to ensure the user is an admin
  bookingController.getAllReservations // Controller function to fetch all database records
);

/**
 * PUT /bookings/admin/update/:bookingId
 * Update an existing reservation record directly from the admin panel
 *
 * REQUIRES: JWT authentication AND Admin Role verification
 * URL PARAMS: bookingId - The ID of the reservation to update
 * REQUEST BODY: roomNumber, fromDate, toDate, totalCost, status
 */
bookingRouter.put(
  "/admin/update/:bookingId",
  authMiddleWear.isAdmin, // Protects endpoint from regular users
  bookingController.updateReservation
);

/**
 * DELETE /bookings/admin/delete/:bookingId
 * Hard delete a reservation record from the database
 *
 * REQUIRES: JWT authentication AND Admin Role verification
 * URL PARAMS: bookingId - The ID of the reservation to remove
 */
bookingRouter.delete(
  "/admin/delete/:bookingId",
  authMiddleWear.isAdmin, // Protects endpoint from regular users
  bookingController.deleteReservation
);

/**
 * GET /bookings/admin/dashboard-stats
 * Returns aggregated stats for the admin dashboard panel
 * REQUIRES: JWT authentication AND Admin Role verification
 */
bookingRouter.get(
  "/admin/dashboard-stats",
  authMiddleWear.isAdmin,
  bookingController.getDashboardStats
);


module.exports = bookingRouter;
