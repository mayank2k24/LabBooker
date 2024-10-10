// models/Conflict.js
const mongoose = require('mongoose');

const ConflictSchema = new mongoose.Schema({
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
  status:{type:String,enum:['pending','approved','rejected'],default:'approved'},
  CreatedAt: Date,
});

module.exports = mongoose.model('Conflict', ConflictSchema);
