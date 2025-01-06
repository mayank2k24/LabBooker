const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resourceId: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  status:{
    type:String,
    enum:['pending','approved','rejected'],
    default:'approved'
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
},{timestamps:true });

module.exports = mongoose.model('Booking', BookingSchema);