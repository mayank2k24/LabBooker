// models/System.js
const mongoose = require('mongoose');

const SystemSchema = new mongoose.Schema({
  name: String,
  isBooked: { type: Boolean, default: false }
});

module.exports = mongoose.model('System', SystemSchema);