// models/SaveraBooking.js
const mongoose = require('mongoose');

const SaveraBookingSchema = new mongoose.Schema({
  date: Date,
  startTime: String,
  endTime: String,
  subject: String
});

module.exports = mongoose.model('SaveraBooking', SaveraBookingSchema);