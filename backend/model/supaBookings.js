/**
 * ========== BOOKINGS MODEL ==========
 * Database layer for all booking operations
 * Handles Supabase API queries related to creating, updating, and retrieving bookings
 */

// Import the configured Supabase client
const { supabase } = require("../db/supabase.js");
const dayjs = require("dayjs");

/**
 * ==========================================
 * SECURE BOOKING METHODS
 * ==========================================
 */

/**
 * checkAvailabilitySecure - Check room availability
 * * @param {number} roomNumber - Room ID to check
 * @param {string} fromDate - User check-in date (YYYY-MM-DD)
 * @param {string} toDate - User check-out date (YYYY-MM-DD)
 * @returns {boolean} true if available, false if booked
 */
module.exports.checkAvailabilitySecure = async (roomNumber, fromDate, toDate) => {
  try {
    // Get the timestamp from 15 minutes ago for pending check
    const fifteenMinutesAgo = dayjs().subtract(15, 'minute').toISOString();

    // Query bookings matching conflicting criteria
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('roomNumber', roomNumber)
      .or(`status.eq.confirmed,and(status.eq.pending,createdAt.gt.${fifteenMinutesAgo})`)
      .not('toDate', 'lte', fromDate)
      .not('fromDate', 'gte', toDate);

    if (error) throw error;

    // Available if no overlapping bookings are found
    return data.length === 0;
  } catch (error) {
    console.log("Secure availability check error:", error);
    throw error;
  }
};

/**
 * createNewBookingSecure - Create a pending booking record
 *
 * @param {number} userId - Booking user's ID
 * @param {number} roomNumber - Room being booked
 * @param {string} fromDate - Check-in date (YYYY-MM-DD)
 * @param {string} toDate - Check-out date (YYYY-MM-DD)
 * @param {number} totalCost - Total cost
 * @returns {number} bookingId - The new booking ID
 */
module.exports.createNewBookingSecure = async (userId, roomNumber, fromDate, toDate, totalCost) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        { 
          userId, 
          roomNumber, 
          status: 'pending', 
          fromDate, 
          toDate, 
          totalCost 
        }
      ])
      .select('bookingId')
      .single();

    if (error) throw error;

    return data.bookingId;
  } catch (error) {
    console.log("Secure creation error:", error);
    throw error;
  }
};

/**
 * ==========================================
 * STANDARD USER METHODS
 * ==========================================
 */

/**
 * confirmBooking - Update booking status from 'pending' to 'confirmed'
 */
module.exports.confirmBooking = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('bookingId', bookingId)
    .select();

  if (error) throw error;
  return data;
};

/**
 * getUserBookings - Fetch all bookings for a specific user
 */
module.exports.getUserBookings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, room(type)')
      .eq('userId', userId);

    if (error) throw error;

    return data.length === 0 ? false : data;
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
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('userId', userId)
      .eq('bookingId', bookingId)
      .select();

    if (error) throw error;

    return data.length > 0;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * ==========================================
 * ADMIN-ONLY FUNCTIONS
 * ==========================================
 */

/**
 * getSummaryStatus - Get comprehensive booking statistics for admin dashboard
 */
module.exports.getSummaryStatus = async () => {
  try {
    const dbToday = dayjs().format("YYYY-MM-DD");
    const next7Days = dayjs().add(7, 'day').format("YYYY-MM-DD");

    // Fetch all records once to aggregate statistics memory-efficiently
    const { data: allBookings, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) throw error;

    let upcomingBookings = 0;
    let todaysBookings = 0;
    let cancelledBookings = 0;
    let pendingBookings = 0;
    let next7DaysBookings = 0;
    let totalRevenue = 0;
    let next7DaysRevenue = 0;

    allBookings.forEach(b => {
      const bFromDate = dayjs(b.fromDate).format("YYYY-MM-DD");
      const cost = parseFloat(b.totalCost) || 0;

      if (b.status === 'confirmed' && bFromDate > dbToday) upcomingBookings++;
      if (b.status === 'confirmed' && bFromDate === dbToday) todaysBookings++;
      if (b.status === 'cancelled' && bFromDate > dbToday) cancelledBookings++;
      if (b.status === 'pending' && bFromDate > dbToday) pendingBookings++;
      
      if (b.status === 'confirmed' && bFromDate >= dbToday && bFromDate <= next7Days) {
        next7DaysBookings++;
      }

      if (b.status === 'confirmed') {
        totalRevenue += cost;
      }

      if (b.status === 'confirmed' && bFromDate > dbToday && bFromDate <= next7Days) {
        next7DaysRevenue += cost;
      }
    });

    return {
      upcomingBookings,
      todaysBookings,
      cancelledBookings,
      pendingBookings,
      totalBookings: allBookings.length,
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
    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * updateBookingById - Update row fields inside the Supabase bookings table
 * @param {string|number} bookingId - The ID of the reservation to update
 * @param {object} updateData - Object containing roomNumber, fromDate, toDate, totalCost, status
 * @returns {boolean} - Returns true if a row was updated, false otherwise
 */
module.exports.updateBookingById = async (bookingId, updateData) => {
  try {
    // Run update query on the target database row tracking item id
    const { data, error } = await supabase
      .from("bookings")
      .update({
        roomNumber: updateData.roomNumber,
        fromDate: updateData.fromDate,
        toDate: updateData.toDate,
        totalCost: parseFloat(updateData.totalCost),
        status: updateData.status
      })
      .eq("bookingId", bookingId); // Adjust property string name if database uses 'id'

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Database Error updating booking data records:", err.message);
    throw err;
  }
};

/**
 * deleteBookingById - Delete a row from the Supabase bookings table
 * @param {string|number} bookingId - The ID of the reservation to remove
 * @returns {boolean} - Returns true if a row was deleted, false otherwise
 */
module.exports.deleteBookingById = async (bookingId) => {
  try {
    // Run deletion command statement targeted tracking matching id parameters
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("bookingId", bookingId); // Adjust property string name if database uses 'id'

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Database Error removing booking data records:", err.message);
    throw err;
  }
};