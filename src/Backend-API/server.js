const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { scheduleBookingUpdates } = require('./utils/scheduleTasks');
const logoutTimer = require('./middleware/logoutTimer');
require('dotenv').config();
require('newrelic');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(bodyParser.json());
app.use(logoutTimer);
axios.defaults.baseURL = process.env.AXIOS_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
  res.send('LabBooker API is running');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/admin', require('./routes/Conflicts'));
app.use('/api/savera', require('./routes/savera'));
app.use('/api/system', require('./routes/system'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err);
  res.status(500).json({ msg: 'Server Error', error: err.message });
});

// Token refresh middleware
app.use((req, res, next) => {
  if(req.tokenNearExpiry) {
    const newToken = jwt.sign(
      { user: req.user },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.setHeader('X-New-Token', newToken);
  }
  next();
});

scheduleBookingUpdates();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));