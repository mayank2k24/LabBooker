// In src/Backend-API/server.js or a separate route file

const express = require('express');
const router = express.Router();
const SaveraBooking = require('../models/SaveraBooking');

router.post('/api/savera-school/bookings', async (req, res) => {
  try {
    const { date, startTime, endTime, subject } = req.body;
    const newBooking = new SaveraBooking({ date, startTime, endTime, subject });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/api/savera-school/bookings', async (req, res) => {
  try {
    const bookings = await SaveraBooking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;