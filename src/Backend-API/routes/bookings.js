const express = require('express');
const router = express.Router();
const {verifyToken,generateToken} = require('../middleware/auth');
const Booking = require('../models/Booking');
const { checkAvailability } = require('../utils/bookingHelpers');
const { compareSync } = require('bcryptjs');

// POST /api/bookings
router.post('/', verifyToken, async (req, res) => {
  console.log('Received booking request. Body:', JSON.stringify(req.body, null, 2));
  try {
    const { resourceId, resource , start, end } = req.body;
    
    console.log('Received booking data:', { resourceId, resource ,start, end });

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!resourceId || !resource || !start || !end) {
      console.log('Missing fields. resourceId:', resourceId, 'resource:', resource, 'start:', start, 'end:', end);
      return res.status(400).json({ error: 'Missing required fields', received: { resourceId, resource, start, end } });
    }

    // if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    //   return res.status(400).json({ msg: 'Invalid Date format' });
    // }

    // if (!isNaN(Date.parse(start)) || !isNaN(Date.parse(end))) {
    //   return res.status(400).json({ error: 'Invalid date format' });
    // }

    // Check if the booking date is valid (3 days to 2 hours before)
    const now = new Date();
    const minDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    const maxDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

    if (startDate < minDate || startDate > maxDate) {
      return res.status(400).json({ msg: 'Invalid booking date. Must be between 2 hours and 14 days from now.' });
    }

    const { isAvailable, conflicts } = await checkAvailability(resourceId, startDate, endDate);

    if (!isAvailable) {
      return res.status(409).json({ 
        error: 'Resource is not available for the selected time slot',
        conflicts
      });
    }

    const newBooking = new Booking({
      user: req.user.id,
      resourceId,
      resource,
      start: startDate,
      end: endDate
    });

    const booking = await newBooking.save();
    console.log('Booking created:', booking);
    res.json(booking);
  } catch (err) {
    console.error('Server error in POST /api/bookings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get bookings with pagination and search
router.get('/', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const startIndex = (page - 1) * limit;

    const now = new Date();

    const searchQuery = search 
    ? { 
        resource: { $regex: search, $options: 'i' },
        end: { $gte: now },
        user: req.user.id
      } 
    : { 
        end: { $gte: now },
        user: req.user.id 
      };

    const total = await Booking.countDocuments(searchQuery);
    
    const bookings = await Booking.find(searchQuery)
      .sort({ start: 1 })
      .limit(limit)
      .skip(startIndex);

      console.log('Fetched Bookings:', bookings);
    res.json({
      bookings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBookings: total
    });
  } catch (err) {
    console.error('Error fetching bookings:',err);
    res.status(500).send('Server Error');
  }
});

// Get all bookings for a user
router.get('/user', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ start: 1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get the booking history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ start: -1 })
      .limit(20)
      .lean();  // limit to 20 for more history

      // ISO format Date
      const formattedBookings = bookings.map(booking => ({
        ...booking,
        start: booking.start.toISOString(),
        end: booking.end.toISOString()
      }));
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a booking
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Make sure user owns booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error('Server error in DELETE /api/bookings/:id:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Get all bookings for calendar view
router.get('/all', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/bookings/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { resource, start,end } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    
    const { isAvailable, conflicts } = await checkAvailability(resource, new Date(start), new Date(end), booking._id);

    if (!isAvailable && !req.query.override) {
      return res.status(409).json({ 
        msg: 'Resource is not available for the selected time slot',
        conflicts
      });
    }
    Object.assign(booking, req.body);

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/bookings/stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const now = new Date();

    const totalBookings = await Booking.countDocuments({ user: req.user.id });
    const upcomingBookings = await Booking.countDocuments({ 
      user: req.user.id,
      start: { $gte: now }
    });
    const pastBookings = await Booking.countDocuments({ 
      user: req.user.id,
      end: { $lt: now }
    });

    const mostBookedResource = await Booking.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$resource', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      totalBookings,
      upcomingBookings,
      pastBookings,
      mostBookedResource: mostBookedResource[0] ? mostBookedResource[0]._id : 'N/A'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;