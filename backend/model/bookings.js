/**
 * ========== BOOKINGS MODEL ==========
 * Database layer for all booking operations
 * Handles SQL queries related to creating, updating, and retrieving bookings
 */

const db = require("../db/db");
const dayjs = require("dayjs");

/**
 * ==========================================
 *     TRANSACTION MANAGEMENT METHODS
 * ==========================================
 */

/**
 * Start a new database transaction
 * @returns {object} The connection/transaction instance
 */
module.exports.startTransaction = async () => {
  const connection = await db.getConnection();
  await connection.beginTransaction();
  return connection;
};

/**
 * Commit an active transaction and release its connection
 * @param {object} connection - The active transaction connection
 */
module.exports.commitTransaction = async (connection) => {
  if (connection) {
    await connection.commit();
    connection.release();
  }
};

/**
 * Roll back an active transaction and release its connection
 * @param {object} connection - The active transaction connection
 */
module.exports.rollbackTransaction = async (connection) => {
  if (connection) {
    await connection.rollback();
    connection.release();
  }
};

/**
 * ==========================================
 *         SECURE BOOKING METHODS
 * ==========================================
 */

/**
 * checkAvailabilitySecure - Check room availability with row-level pessimistic locking
 *
 * LOGIC:
 * 1. Appends 'FOR UPDATE' to the query. This tells the database to place a exclusive lock
 *    on matching records within the transaction.
 * 2. Any concurrent booking attempt targeting the same criteria will block and wait
 *    until this transaction issues a commit or rollback.
 *
 * @param {number} roomNumber - Room ID to check
 * @param {string} fromDate - User check-in date (YYYY-MM-DD)
 * @param {string} toDate - User check-out date (YYYY-MM-DD)
 * @param {object} transaction - The active database connection transaction
 * @returns {boolean} true if available, false if booked
 */
module.exports.checkAvailabilitySecure = async (
  roomNumber,
  fromDate,
  toDate,
  transaction,
) => {
  try {
    // If no transaction context was passed, fall back to default pool execution
    const executor = transaction || db;

    const query = `
      SELECT * FROM bookings
      WHERE roomNumber = ?
      AND (
        status = 'confirmed'
        OR (status = 'pending' AND createdAt > NOW() - INTERVAL 15 MINUTE)
      )
      AND NOT (toDate <= ? OR fromDate >= ?)
      FOR UPDATE
    `;

    // Execute query within the explicit transaction boundary
    const [result] = await executor.execute(query, [
      roomNumber,
      fromDate,
      toDate,
    ]);

    return result.length === 0;
  } catch (error) {
    console.log("Secure availability check error:", error);
    throw error;
  }
};

/**
 * createNewBookingSecure - Create a pending booking inside a transaction block
 *
 * @param {number} userId - Booking user's ID
 * @param {number} roomNumber - Room being booked
 * @param {string} fromDate - Check-in date (YYYY-MM-DD)
 * @param {string} toDate - Check-out date (YYYY-MM-DD)
 * @param {number} totalCost - Total cost
 * @param {object} transaction - The active database connection transaction
 * @returns {number} insertId - The new booking ID
 */
module.exports.createNewBookingSecure = async (
  userId,
  roomNumber,
  fromDate,
  toDate,
  totalCost,
  transaction,
) => {
  try {
    const executor = transaction || db;

    const query = `
      INSERT INTO bookings (userId, roomNumber, status, fromDate, toDate, totalCost)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await executor.execute(query, [
      userId,
      roomNumber,
      "pending",
      fromDate,
      toDate,
      totalCost,
    ]);

    return result.insertId;
  } catch (error) {
    console.log("Secure creation error:", error);
    throw error;
  }
};

/**
 * ==========================================
 *         STANDARD USER METHODS
 * ==========================================
 */

/**
 * confirmBooking - Update booking status from 'pending' to 'confirmed'
 */
module.exports.confirmBooking = async (bookingId) => {
  const query = "UPDATE bookings SET status = 'confirmed' WHERE bookingId = ?";
  const [result] = await db.execute(query, [bookingId]);
  return result;
};

/**
 * getUserBookings - Fetch all bookings for a specific user
 */
module.exports.getUserBookings = async (userId) => {
  try {
    const query = "SELECT * FROM bookings WHERE userId = ?";
    const [result] = await db.execute(query, [userId]);

    if (result.length == 0) {
      return false;
    } else {
      return result;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * cancelUserBooking - Cancel a user's booking
 */
module.exports.cancelUserBooking = async (userId, bookingId) => {
  try {
    const query =
      "UPDATE bookings SET status = ? WHERE userId = ? AND bookingId = ?";

    const [result] = await db.execute(query, ["cancelled", userId, bookingId]);

    if (result.affectedRows == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * ==========================================
 *          ADMIN-ONLY FUNCTIONS
 * ==========================================
 */

/**
 * getSummaryStatus - Get comprehensive booking statistics for admin dashboard
 */
module.exports.getSummaryStatus = async () => {
  try {
    const today = dayjs();
    const dbToday = today.format("YYYY-MM-DD");

    const upcomingBookingQuery =
      "SELECT COUNT(*) AS count FROM bookings WHERE DATE(fromDate) > ? AND status = ?";
    const [upcomingResult] = await db.execute(upcomingBookingQuery, [
      dbToday,
      "confirmed",
    ]);
    const upcomingBookings = upcomingResult[0].count;

    const todaysBookingQuery =
      "SELECT COUNT(*) AS count FROM bookings WHERE DATE(fromDate) = ? AND status = ?";
    const [todayResult] = await db.execute(todaysBookingQuery, [
      dbToday,
      "confirmed",
    ]);
    const todaysBookings = todayResult[0].count;

    const cancelledBookingQuery =
      "SELECT COUNT(*) AS count FROM bookings WHERE status = ? AND DATE(fromDate) > ?";
    const [cancelledBookingResult] = await db.execute(cancelledBookingQuery, [
      "cancelled",
      dbToday,
    ]);
    const cancelledBookings = cancelledBookingResult[0].count;

    const pendingBookingQuery = `
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE status = ?
        AND fromDate > ?
    `;
    const [pendingBookingResult] = await db.execute(pendingBookingQuery, [
      "pending",
      dbToday,
    ]);
    const pendingBookings = pendingBookingResult[0].count;

    const totalBookingQuery = `
      SELECT COUNT(*) AS count
      FROM bookings
    `;
    const [totalBookingResult] = await db.execute(totalBookingQuery);
    const totalBookings = totalBookingResult[0].count;

    const next7DaysQuery = `
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE fromDate BETWEEN ? AND DATE_ADD(?, INTERVAL 7 DAY)
        AND status = ?
    `;
    const [next7DaysResult] = await db.execute(next7DaysQuery, [
      dbToday,
      dbToday,
      "confirmed",
    ]);
    const next7DaysBookings = next7DaysResult[0].count;

    const totalRevenueQuery = `
      SELECT SUM(totalCost) AS totalRevenue
      FROM bookings
      WHERE status = ?
    `;
    const [totalRevenueResult] = await db.execute(totalRevenueQuery, [
      "confirmed",
    ]);
    const totalRevenue = parseFloat(totalRevenueResult[0].totalRevenue) || 0;

    const next7DaysRevenueQuery = `
      SELECT SUM(totalCost) AS next7DaysRevenue
      FROM bookings
      WHERE status = ?
        AND fromDate > ?
        AND fromDate <= DATE_ADD(?, INTERVAL 7 DAY)
    `;
    const [next7DaysRevenueResult] = await db.execute(next7DaysRevenueQuery, [
      "confirmed",
      dbToday,
      dbToday,
    ]);
    const next7DaysRevenue =
      parseFloat(next7DaysRevenueResult[0].next7DaysRevenue) || 0;

    return {
      upcomingBookings,
      todaysBookings,
      cancelledBookings,
      pendingBookings,
      totalBookings,
      next7DaysBookings,
      totalRevenue,
      next7DaysRevenue,
    };
  } catch (error) {
    console.error("Error fetching summary status:", error);
    throw error;
  }
};

/**
 * getAllBookings - Get complete list of all bookings for admin management
 */
module.exports.getAllBookings = async () => {
  try {
    const getAllBookingsQuery = "SELECT * FROM bookings";
    const [allBookings] = await db.execute(getAllBookingsQuery);
    return allBookings;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
