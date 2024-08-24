const express = require('express');
const router = express.Router();
const System = require('../models/System'); 

router.get('/api/systems', async (req, res) => {
  try {
    const systems = await System.find();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/api/bookings', async (req, res) => {
  try {
    const { resourceId } = req.body;
    const system = await System.findById(resourceId);
    if (!system) {
      return res.status(404).json({ message: 'System not found' });
    }
    if (system.isBooked) {
      return res.status(400).json({ message: 'System already booked' });
    }
    system.isBooked = true;
    await system.save();
    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;