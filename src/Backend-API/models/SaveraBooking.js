const mongoose = require('mongoose');

const SaveraBookingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time!`
    }
  },
  endTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time!`
    }
  },
  seat: { type: String, required: true },
  classroom: { type: String, required: true },
});

module.exports = mongoose.model('SaveraBooking', SaveraBookingSchema);