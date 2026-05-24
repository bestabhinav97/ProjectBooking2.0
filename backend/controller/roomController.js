/**
 * ========== ROOM CONTROLLER ==========
 * Handles room-related queries:
 * - Getting available rooms for date range and bed requirements
 */

const dayjs = require("dayjs");
const roomModel = require("../model/supaRoom");
const helperFunction = require("../utils/helperFunctions");

/**
 * getAllAvailableRoom - Fetch available rooms for requested dates and bed count
 *
 * FLOW:
 * 1. Extract query parameters: fromDate, toDate, noOfBedsRequired
 * 2. Validate number of beds required (must be >= 1)
 * 3. Validate date range (valid format, not in past, check-out after check-in)
 * 4. Format dates to YYYY-MM-DD for database query
 * 5. Query database for rooms with >= requested beds that aren't booked
 * 6. Return matching rooms or empty array if none available
 *
 * REQUEST BODY:
 *   - fromDate: Check-in date (YYYY-MM-DD)
 *   - toDate: Check-out date (YYYY-MM-DD)
 *   - noOfBedsRequired: Minimum number of beds needed
 *
 * RETURNS: Array of available room objects with details
 */
module.exports.getAllAvailableRoom = async (req, res, next) => {
  const { fromDate, toDate, noOfBedsRequired } = req.body;

  const startDate = dayjs(fromDate);
  const endDate = dayjs(toDate);

  try {
    // ===== VALIDATION STEP 1 =====
    if (noOfBedsRequired <= 0) {
      return res.status(404).json({
        success: false,
        message: "No of beds should be at least 1",
      });
    }

    // ===== VALIDATION STEP 2 =====
    const checkDate = helperFunction.checkDates(fromDate, toDate);
    if (checkDate.success == false) {
      return res.status(400).json({
        success: false,
        message: checkDate.message,
      });
    }

    // ===== FORMAT DATES =====
    const dbStartDate = startDate.format("YYYY-MM-DD");
    const dbEndDate = endDate.format("YYYY-MM-DD");

    // ===== FETCH ROOMS =====
    const result = await roomModel.getAllAvailableRooms(
      noOfBedsRequired,
      dbEndDate,
      dbStartDate,
    );

    if (!result || result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No rooms available for these dates.",
        data: [],
      });
    }

    // ===== ADD IMAGE URL LOGIC (NEW PART) =====
    const formattedRooms = result.map((room) => ({
      ...room,
      image_url: `/room-photos/${room.noOfBeds}B_photo.png`,
    }));

    // ===== RETURN RESPONSE =====
    return res.status(200).json({
      success: true,
      message: "ROOMS FETCHED",
      data: formattedRooms,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * ADMIN: Get all rooms
 */
module.exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomModel.getAllRooms();

    return res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Create room
 */
module.exports.createRoom = async (req, res, next) => {
  try {
    const result = await roomModel.createRoom(req.body);

    return res.status(201).json({
      success: true,
      message: "ROOM CREATED",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Update room
 */
module.exports.updateRoom = async (req, res, next) => {
  try {
    const result = await roomModel.updateRoom(
      req.params.roomNumber,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "ROOM UPDATED",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Delete room
 */
module.exports.deleteRoom = async (req, res, next) => {
  try {
    await roomModel.deleteRoom(req.params.roomNumber);

    return res.status(200).json({
      success: true,
      message: "ROOM DELETED",
    });
  } catch (error) {
    next(error);
  }
};