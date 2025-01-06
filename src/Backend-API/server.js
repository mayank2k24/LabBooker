const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { scheduleBookingUpdates } = require("./utils/scheduleTasks");
const logoutTimer = require("./middleware/logoutTimer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Middleware
const corsOptions = {
  origin: [
    'https://labbooker.mayankgroup.tech',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json());
app.use(logoutTimer);


axios.defaults.headers.post["Content-Type"] = "application/json";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    dbName: "LabBooker",
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  console.log(`Debug: Received request - ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", (req, res, next) => {
  console.log("Debug: Entered /api/auth middleware");
  next();
});

// Basic route
app.get("/", (req, res) => {
  res.send("LabBooker API is running");
});


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/admin", require("./routes/Conflicts"));
app.use("/api/users", require("./routes/auth"));


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err);
  res.status(500).json({ msg: "Server Error", error: err.message });
});

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware to check token expiration
app.use(async (req, res, next) => {
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
    return next();
  }
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const lastActivity = new Date(decoded.lastActivity);
    const now = new Date();
    const timeDiff = (now - lastActivity) / 1000 / 60; 

    if (timeDiff > 30) { 
      return res.status(401).json({ message: 'Session expired' });
    }

    const newToken = jwt.sign(
      { ...decoded, lastActivity: now },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
      res.setHeader('New-Token', newToken);
      req.user = decoded;
    next();
  } catch (error) {
    if (!res.headersSent) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next(error);
  }
});

app.use((req, res, next) => {
  if (req.tokenNearExpiry) {
    const newToken = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.setHeader("X-New-Token", newToken);
  }
  next();
});

// Production error handling
if (process.env.NODE_ENV === 'production') {
  app.use((err,res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
  });
}


scheduleBookingUpdates();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
