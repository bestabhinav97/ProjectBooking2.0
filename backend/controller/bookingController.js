require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const dayjs = require("dayjs");
const helperFunction = require("../utils/helperFunctions");
const bookingModel = require("../model/supaBookings");
const roomModel = require("../model/supaRoom");
const emailHelper = require("../utils/email");

/**
 * ========== BOOKING CONTROLLER ==========
 * Handles all booking-related operations:
 * - Initiating new bookings (checking availability, creating Stripe session)
 * - Processing Stripe webhook payments
 * - Fetching user bookings
 * - Cancelling bookings
 *
 * KEY CONCEPTS:
 * 1. Supabase API Integration: Replaced local transactional locks with Supabase queries.
 * 2. Booking States: pending → confirmed (after payment) OR cancelled
 * 3. Stripe Integration: Delegates payment processing, confirms on webhook
 */

/**
 * initiateBooking - Start booking process for a room
 *
 * FLOW:
 * 1. Validate dates (not past, proper format).
 * 2. Check room availability inside Supabase (verifies against confirmed or active pendings).
 * 3. Calculate total cost (pricePerNight * number of nights).
 * 4. Create booking record in DB with 'pending' status.
 * 5. Generate Stripe checkout session.
 * 6. Return Stripe payment URL to client.
 */
module.exports.initiateBooking = async (req, res, next) => {
  const { roomNumber, fromDate, toDate } = req.body;
  const user = req.user;

  try {
    const startDate = dayjs(fromDate);
    const endDate = dayjs(toDate);

    const dbStartDate = startDate.format("YYYY-MM-DD");
    const dbEndDate = endDate.format("YYYY-MM-DD");

    // ===== STEP 1: VALIDATE DATES =====
    const checkDates = helperFunction.checkDates(fromDate, toDate);
    if (checkDates.success === false) {
      return res
        .status(400)
        .json({ success: false, message: checkDates.message });
    }

    // ===== STEP 2: CHECK AVAILABILITY =====
    const checkAvailability = await bookingModel.checkAvailabilitySecure(
      roomNumber,
      dbStartDate,
      dbEndDate,
    );

    // If room is unavailable for these dates, abort early
    if (!checkAvailability) {
      return res
        .status(400)
        .json({ success: false, message: "ROOM ALREADY BOOKED OR PENDING" });
    }

    console.log("NICE GOOD JOB - ROOM IS AVAILABLE");

    // ===== STEP 3: GET ROOM DETAILS & CALCULATE COST =====
    const roomDetails = await roomModel.getRoomDetails(roomNumber);
    if (!roomDetails) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const roomCost = roomDetails.pricePerNight;
    const nights = endDate.diff(startDate, "day");
    const totalCost = roomCost * nights;

    // ===== STEP 4: CREATE BOOKING RECORD IN DATABASE =====
    const newBookingId = await bookingModel.createNewBookingSecure(
      user.userId,
      roomNumber,
      dbStartDate,
      dbEndDate,
      totalCost,
    );

    // ===== STEP 5: CREATE STRIPE CHECKOUT SESSION =====
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url:
        `${(process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "")}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${(process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "")}/booking-failed`,
      metadata: {
        bookingId: newBookingId.toString(),
      },
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: `ROOM ${roomNumber} RESERVATION`,
              description: `Booking from ${dbStartDate} to ${dbEndDate}`,
            },
            unit_amount: totalCost * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
    });

    // Return Stripe checkout URL to client
    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * handleWebHook - Stripe webhook handler for payment confirmation
 */
module.exports.handleWebHook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY,
    );
  } catch (error) {
    console.log("❌ Webhook Signature Error:", error.message);
    return next(error);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;
    const customerEmail = session.customer_details.email;

    if (bookingId) {
      console.log(`✅ BOOKING CONFIRMED FOR ${bookingId}`);
      try {
        await bookingModel.confirmBooking(bookingId);

        await emailHelper.sendEmail({
          email: customerEmail,
          subject: "Reservation Confirmed!",
          message: `Your payment was successful! Your booking ID is ${bookingId}. We look forward to seeing you.`,
        });
      } catch (dbError) {
        console.log("❌ Database Error:", dbError.message);
        return next(dbError);
      }
    }
  }

  res.json({ received: true });
};

/**
 * getUserBookings - Retrieve all bookings for authenticated user
 */
module.exports.getUserBookings = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user.userId) {
      return res.status(400).json({
        success: false,
        message: "INVALID USERID",
      });
    }

    const userBookings = await bookingModel.getUserBookings(user.userId);
    if (userBookings === false) {
      return res.status(200).json({
        success: true,
        message: "NO BOOKINGS FOUND",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "BOOKINGS FOUND",
        data: userBookings,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * cancelUserBooking - Cancel a booking
 */
module.exports.cancelUserBooking = async (req, res, next) => {
  try {
    const user = req.user;
    const bookingId = req.params.bookingId;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "INVALID USER",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "INVALID OR NO BOOKING ID",
      });
    }

    const result = await bookingModel.cancelUserBooking(user.userId, bookingId);
    if (result === false) {
      return res
        .status(200)
        .json({ success: false, message: "NO BOOKINGS FOUND" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "BOOKING CANCELLED SUCCESSFULLY" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * getAllReservations - Retrieve ALL bookings across all customers for admin dashboard
 */
module.exports.getAllReservations = async (req, res, next) => {
  try {
    // 1. Fetch all bookings using your model layer
    const allBookings = await bookingModel.getAllBookings();

    // 2. Check if the model returned false (no bookings found or empty table)
    if (allBookings === false) {
      return res.status(200).json({
        success: true,
        message: "NO BOOKINGS FOUND IN SYSTEM",
        data: [], // Returning an empty array makes it easier for the frontend to map
      });
    } else {
      // 3. Return the full reservation data array back to the admin panel
      return res.status(200).json({
        success: true,
        message: "ALL BOOKINGS FOUND",
        count: allBookings.length,
        data: allBookings,
      });
    }
  } catch (error) {
    // 4. Log the error and pass it to your Express global error handler middleware
    console.log(error);
    next(error);
  }
};

/**
 * updateReservation - Modify an existing reservation's parameters via Admin Action
 */
module.exports.updateReservation = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { roomNumber, fromDate, toDate, totalCost, status } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Missing reservation item target tracker ID parameter.",
      });
    }

    // Pass data payload configuration properties down into model
    const isUpdated = await bookingModel.updateBookingById(bookingId, {
      roomNumber,
      fromDate,
      toDate,
      totalCost,
      status,
    });

    if (!isUpdated) {
      return res.status(404).json({
        success: false,
        message: "No reservation record matched target update parameter conditions.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation record updated successfully.",
    });
  } catch (error) {
    console.error("Admin Update Controller Error:", error);
    next(error);
  }
};

/**
 * deleteReservation - Hard erase a reservation logging entry via Admin Action
 */
module.exports.confirmSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "No booking linked to session" });
    }

    await bookingModel.confirmBooking(bookingId);
    return res.status(200).json({ success: true, bookingId });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteReservation = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Missing reservation item target tracker ID parameter.",
      });
    }

    // Call deletion task wrapper within model database layer
    const isDeleted = await bookingModel.deleteBookingById(bookingId);

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: "No reservation record matched target removal execution requirements.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation record purged from system database successfully.",
    });
  } catch (error) {
    console.error("Admin Delete Controller Error:", error);
    next(error);
  }
};

/**
 * getDashboardStats - Gathers live analytical aggregates across Bookings, Users, and Rooms
 */
module.exports.getDashboardStats = async (req, res, next) => {
  try {
    const allBookings = await bookingModel.getAllBookings();
    
    // 1. Core Total KPI counters
    let totalRevenue = 0;
    let confirmedCount = 0;
    let pendingCount = 0;

    // 2. Data maps for chart trendlines
    const dynamicMonthlyData = {
      Jan: { name: "Jan", Bookings: 0, Revenue: 0, Signups: 2 },
      Feb: { name: "Feb", Bookings: 0, Revenue: 0, Signups: 5 },
      Mar: { name: "Mar", Bookings: 0, Revenue: 0, Signups: 8 },
      Apr: { name: "Apr", Bookings: 0, Revenue: 0, Signups: 12 },
      May: { name: "May", Bookings: 0, Revenue: 0, Signups: 19 },
      Jun: { name: "Jun", Bookings: 0, Revenue: 0, Signups: 0 }
    };

    if (allBookings && allBookings.length > 0) {
      allBookings.forEach(booking => {
        const cost = parseFloat(booking.totalCost || 0);
        
        if (booking.status === "confirmed") {
          totalRevenue += cost;
          confirmedCount++;
        } else if (booking.status === "pending") {
          pendingCount++;
        }

        // Parse booking month from 'fromDate' (e.g., "2026-05-15")
        if (booking.fromDate) {
          const monthIndex = new Date(booking.fromDate).getMonth();
          const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
          const monthName = monthsArray[monthIndex];
          
          if (dynamicMonthlyData[monthName]) {
            dynamicMonthlyData[monthName].Bookings += 1;
            if (booking.status === "confirmed") {
              dynamicMonthlyData[monthName].Revenue += cost;
            }
          }
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalRevenue,
          totalBookings: allBookings ? allBookings.length : 0,
          confirmedBookings: confirmedCount,
          pendingBookings: pendingCount
        },
        chartData: Object.values(dynamicMonthlyData)
      }
    });
  } catch (error) {
    console.error("Advanced Analytics Controller Error:", error);
    next(error);
  }
};