// models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);