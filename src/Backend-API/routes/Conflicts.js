const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Conflict = require('../models/Conflict');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Apply verifyToken middleware to all admin routes
router.use(verifyToken);

const getActiveBookings = async (userId = null) => { // utility function
  const now = new Date();
  const query = {
    end: { $gte: now }
  };
  
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    query.user = userId;
  }
  
  return await Booking.find(query)
    .populate('user', 'name email')
    .sort({ start: 1 });
};

// GET /api/admin/conflicts
router.get('/conflicts', async (req, res) => {
  try {
    const conflicts = await Conflict.find()
    .populate({
      path: 'bookings',
      populate: [
        { path: 'user', select: 'name email' },
        { path: 'resource', select: 'name' }
      ]
    });
  res.json({success:true,conflicts});
  } catch (error) {
    console.error('Conflicts fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching conflicts' 
    });
  }
});

// POST /api/admin/resolve-conflict/:conflictId
router.post('/resolve-conflict/:conflictId', async (req, res) => {
  try {
    const { conflictId } = req.params;
    const { resolution } = req.body;
    const conflict = await Conflict.findById(conflictId).populate('bookings');
    
    if (!conflict) {
      return res.status(404).json({ message: 'Conflict not found' });
    }
    if (resolution === 'approve') {
      // Approve all bookings in the conflict
      for (const booking of conflict.bookings) {
        booking.status = 'approved';
        await booking.save();
      }
    } else if (resolution === 'reject') {
      // Reject all bookings in the conflict
      for (const booking of conflict.bookings) {
        booking.status = 'rejected';
        await booking.save();
      }
    } else if (resolution === 'partial') {
      // Partial approval - approve the first booking and reject others
      for (let i = 0; i < conflict.bookings.length; i++) {
        if (i === 0) {
          conflict.bookings[i].status = 'approved';
        } else {
          conflict.bookings[i].status = 'rejected';
        }
        await conflict.bookings[i].save();
      }
    } else {
      throw new Error('Invalid resolution type');
    }

    // Update related bookings based on the resolution
    const updatedBookings = await Promise.all(conflict.bookings.map(booking => 
      Booking.findByIdAndUpdate(booking._id, { status: booking.status }, { new: true })
    ));

    console.log('Conflict resolved:', { resolution, updatedBookings });
    await Conflict.findByIdAndDelete(conflictId);
    res.json({ message: 'Conflict resolved & deleted successfully', conflict });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/pending-approvals
router.get('/pending-approvals',verifyToken,async (req, res) => {
  try {
    const pendingUsers = await User.find({ isConfirmed: true, isApproved: "pending" });
    res.json(pendingUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/admin/approve-user/:id
router.post('/approve-user/:id',verifyToken,async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isApproved = "approved";
    await user.save();

    res.json({ msg: 'User approved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort({ start: -1 });;
    res.json({ 
      success: true, 
      bookings: bookings.map(booking => ({
        _id: booking._id,
        resourceId: booking.resourceId || 'Unknown Resource',
        user: {
          name: booking.user?.name || 'Unknown User',
          email: booking.user?.email
        },
        start: booking.start,
        end: booking.end,
        status: booking.status
      }))
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bookings' 
    });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [activeBookings, totalUsers, pendingUsers, totalBookings, conflicts] = await Promise.all([
      getActiveBookings(),
      User.countDocuments(),
      User.countDocuments({ isConfirmed: true, isApproved: 'pending' }),
      Booking.countDocuments(),
      Conflict.countDocuments()
    ]);

    res.json({
      success: true,
      totalUsers,
      pendingUsers,
      totalBookings,
      activeConflicts: conflicts,
      activeBookings: activeBookings.map(booking => ({
        _id: booking._id,
        resourceId: booking.resourceId || 'Unknown Resource',
        user: {
          name: booking.user?.name || 'Unknown User',
          email: booking.user?.email
        },
        start: booking.start,
        end: booking.end,
        status: booking.status
      }))
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching admin statistics',
    });
  }
});


module.exports = router;