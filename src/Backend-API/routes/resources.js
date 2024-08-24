
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const {verifyToken} = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;