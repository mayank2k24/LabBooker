const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { scheduleBookingUpdates } = require('./utils/scheduleTasks');
const logoutTimer = require('./middleware/logoutTimer');
require('dotenv').config();

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

app.use('/api/users', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));

// Basic route
app.get('/', (req, res) => {
  res.send('LabBooker API is running');
});

const adminRoutes = require('./routes/admin');
const saveraRoutes = require('./routes/savera.js');
const systemRoutes = require('./routes/system');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/admin',adminRoutes);
app.use(saveraRoutes);
app.use(systemRoutes);

app.use((err,req,res,next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err);
  res.status(500).json({ msg: 'Server Error', error: err.message });
});
scheduleBookingUpdates();
app.use((req, res, next) => {
  if(req.tokenNearExpiry) {
    const newToken = jwt.sign(
      { user: req.user },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.setHeader('X-New-Token',newToken );
  }
  next();
  });


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));