const express=require('express');
const router = express.Router();
const Conflict = require('../models/Conflict');

router.get('/api/admin/conflicts', async (req, res) => {
    try {
      const conflicts = await Conflict.find().populate('bookings');
      res.json(conflicts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Resolve a conflict
  router.post('/api/admin/resolve-conflict/:conflictId', async (req, res) => {
    try {
      const { conflictId } = req.params;
      const { resolution } = req.body;
      const conflict = await Conflict.findById(conflictId).populate('bookings');
      
      // Implement resolution logic based on the 'resolution' parameter
      // This could involve updating or deleting bookings
  
      await conflict.remove(); // Remove the conflict after resolution
      res.json({ message: 'Conflict resolved' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;