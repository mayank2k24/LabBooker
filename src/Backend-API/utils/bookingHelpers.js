const Booking = require('../models/Booking');

exports.checkAvailability = async (resourceId, start, end, excludeBookingId = null) => {
  try {
    const conflictingBookings = await Booking.find({
      resourceId,
      _id:{ $ne: excludeBookingId },
      $or: [
        { start: { $lt: end }, end: { $gt: start } },
        { start: { $gte: start, $lt: end } },
        { end: { $gt: start, $lte: end } }
      ],
    });

    return {
      isAvailable: conflictingBookings.length === 0,
      conflicts: conflictingBookings
    };
  } catch (error) {
    console.error('Error in checkAvailability:', error);
    throw error;
  }
};