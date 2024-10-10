const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: String,
    enum:['approved','pending'],
    default: 'pending'
  },
  isAdmin:{
    type: Boolean,
    default : false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  confirmationToken: String
});

module.exports = mongoose.model('User', UserSchema);