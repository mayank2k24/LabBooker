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
    'https://gentle-mushroom-0ea6a940f.5.azurestaticapps.net',
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
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
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
