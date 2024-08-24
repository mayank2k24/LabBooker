// models/Conflict.js
const mongoose = require('mongoose');

const ConflictSchema = new mongoose.Schema({
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  resource: String,
  start: Date,
  end: Date
});

module.exports = mongoose.model('Conflict', ConflictSchema);
