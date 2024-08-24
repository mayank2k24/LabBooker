// utils/scheduleTasks.js
const cron = require('node-cron');
const Booking = require('../models/Booking');

const updateExpiredBookings = async () => {
  const now = new Date();
  await Booking.updateMany(
    { end: { $lt: now }, status: 'active' },
    { $set: { status: 'expired' } }
  );
};

const scheduleBookingUpdates = () => {
  // Run every hour
  cron.schedule('0 * * * *', updateExpiredBookings);
};

module.exports = { scheduleBookingUpdates };