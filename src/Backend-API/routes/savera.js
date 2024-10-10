const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const SaveraBooking = require('../models/SaveraBooking');

router.post('/bookings', [
  body('date').isISO8601().toDate(),
  body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  body('seat').notEmpty(),
  body('classroom').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { date, startTime, endTime, seat, classroom } = req.body;
    const newBooking = new SaveraBooking({ date, startTime, endTime, seat, classroom });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const { classroom, date } = req.query;
    const bookings = await SaveraBooking.find({ 
      classroom,
      date: new Date(date)
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;