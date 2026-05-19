require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const dayjs = require("dayjs");
const helperFunction = require("../utils/helperFunctions");
const bookingModel = require("../model/bookings");
const roomModel = require("../model/room");
const emailHelper = require("../utils/email");
// Note: const { client } = require("../reddis"); has been completely removed.

/**
 * ========== BOOKING CONTROLLER ==========
 * Handles all booking-related operations:
 * - Initiating new bookings (checking availability inside a DB transaction, creating Stripe session)
 * - Processing Stripe webhook payments
 * - Fetching user bookings
 * - Cancelling bookings
 *
 * KEY CONCEPTS:
 * 1. Database Transactions: Prevents race conditions by locking overlapping records during verification.
 * 2. Booking States: pending → confirmed (after payment) OR cancelled
 * 3. Stripe Integration: Delegates payment processing, confirms on webhook
 */

/**
 * initiateBooking - Start booking process for a room using DB transactions
 *
 * FLOW:
 * 1. Start a database transaction.
 * 2. Validate dates (not past, proper format).
 * 3. Check room availability inside the transaction using row-level locking (e.g., SELECT FOR UPDATE).
 * 4. Calculate total cost (pricePerNight * number of nights).
 * 5. Create booking record in DB with 'pending' status.
 * 6. Commit the transaction (releasing the database lock).
 * 7. Generate Stripe checkout session.
 * 8. Return Stripe payment URL to client.
 */
module.exports.initiateBooking = async (req, res, next) => {
  const { roomNumber, fromDate, toDate } = req.body;
  const user = req.user;

  // Initialize a transaction variable so it can be managed across try/catch/finally blocks
  let transaction;

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

    // ===== STEP 2: START TRANSACTION & CHECK AVAILABILITY =====
    // Start the database transaction context
    transaction = await bookingModel.startTransaction();

    /**
     * DATABASE LOCK MECHANISM - Prevent Overselling
     * The checkAvailability method must execute a query using a pessimistic lock,
     * for example: "SELECT * FROM bookings WHERE room_id = ? AND ... FOR UPDATE"
     *
     * This forces concurrent execution blocks matching the same room criteria to
     * wait sequentially until this transaction completes.
     */
    const checkAvailability = await bookingModel.checkAvailabilitySecure(
      roomNumber,
      dbStartDate,
      dbEndDate,
      transaction,
    );

    // If room is unavailable for these dates, abort early
    if (!checkAvailability) {
      await bookingModel.rollbackTransaction(transaction);
      return res
        .status(400)
        .json({ success: false, message: "ROOM ALREADY BOOKED OR PENDING" });
    }

    console.log("NICE GOOD JOB - ROOM IS AVAILABLE");

    // ===== STEP 3: GET ROOM DETAILS & CALCULATE COST =====
    const roomDetails = await roomModel.getRoomDetails(roomNumber);
    if (!roomDetails) {
      await bookingModel.rollbackTransaction(transaction);
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const roomCost = roomDetails.pricePerNight;
    const nights = endDate.diff(startDate, "day");
    const totalCost = roomCost * nights;

    // ===== STEP 4: CREATE BOOKING RECORD IN DATABASE =====
    // Pass the transaction context so the insert is locked down until committed
    const newBookingId = await bookingModel.createNewBookingSecure(
      user.userId,
      roomNumber,
      dbStartDate,
      dbEndDate,
      totalCost,
      transaction,
    );

    // ===== STEP 5: COMMIT TRANSACTION =====
    // Commit early right before calling the external Stripe API.
    // This frees up the DB lock immediately so other users aren't left waiting on network calls.
    await bookingModel.commitTransaction(transaction);
    transaction = null; // Mark as cleared so finally block doesn't attempt a rollback

    // ===== STEP 6: CREATE STRIPE CHECKOUT SESSION =====
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url:
        "http://localhost:5173/booking-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/booking-failed",
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
    // If an error happens while the transaction is active, roll it back
    if (transaction) {
      try {
        await bookingModel.rollbackTransaction(transaction);
      } catch (rollbackError) {
        console.error("Failed to rollback transaction:", rollbackError);
      }
    }
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
