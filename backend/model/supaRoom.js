/**
 * ========== ROOM MODEL ==========
 * Database layer for room-related queries
 * Handles Supabase API queries for room availability and details
 */

// Import the configured Supabase client
const { supabase } = require("../db/supabase.js");

/**
 * getAllAvailableRooms - Find rooms available for requested dates with minimum beds
 *
 * @param {number} noOfBeds - Minimum beds required
 * @param {string} userFromDate - User check-in (YYYY-MM-DD)
 * @param {string} userToDate - User check-out (YYYY-MM-DD)
 * @returns {array|false} Array of available rooms, false if none available
 */
module.exports.getAllAvailableRooms = async (
  noOfBeds,
  userFromDate,
  userToDate,
) => {
  try {
    // 1. Get room numbers that have overlapping bookings
    const { data: bookedRooms, error: bookingError } = await supabase
      .from('bookings')
      .select('roomNumber')
      .lt('fromDate', userToDate)
      .gt('toDate', userFromDate);

    if (bookingError) throw bookingError;

    // Extract room numbers into a flat array
    const unavailableRoomNumbers = bookedRooms.map(b => b.roomNumber);

    // 2. Query available rooms matching bed count and excluding unavailable rooms
    let query = supabase
      .from('room')
      .select('*')
      .gte('noOfBeds', noOfBeds);

    // Only apply the filter if there are actually unavailable rooms
    if (unavailableRoomNumbers.length > 0) {
      query = query.not('roomNumber', 'in', `(${unavailableRoomNumbers.join(',')})`);
    }

    const { data: rooms, error: roomError } = await query;

    if (roomError) throw roomError;

    // Return false if no rooms available, otherwise return array
    if (rooms.length === 0) {
      return false;
    }

    return rooms;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
};

/**
 * getRoomDetails - Fetch details for a specific room number
 */
module.exports.getRoomDetails = async (roomNumber) => {
  try {
    const { data, error } = await supabase
      .from('room')
      .select('*')
      .eq('roomNumber', roomNumber)
      .single(); // Returns an object instead of an array

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};