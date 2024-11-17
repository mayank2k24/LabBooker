const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const crypto = require('crypto');
const {verifyToken,generateToken} = require('../middleware/auth');
const { sendConfirmationEmail,sendPasswordResetEmail ,normalizeEmail } = require('../utils/email-worker');
const axios = require("axios");

// GET api/auth/user
// Get logged in user
router.get('/user', verifyToken , async (req, res,next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user:{ ...user.toObject(), isAdmin:user.isAdmin || false}});
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/',async (req, res) => {
  console.log('registration');
  const { name, email, password, captcha } = req.body; 
  const normalizedEmail = normalizeEmail(email);

  try {
    // Verify CAPTCHA
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;

    const captchaResponse = await axios.post(verifyURL, null, {
      params: {
        secret: secretKey,
        response: captcha
      }
    });

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed',
        details: captchaResponse.data['error-codes']
      });
    }

    if (!name || !email || !password) {
      console.log('provide email , password');
      return res.status(400).json({ msg: 'Please provide name, email, and password' });
    }
    console.log('Received registration request:', { name, email});
    
    console.time('findUser');
    let user = await User.findOne({ email:normalizedEmail });
    console.timeEnd('findUser');
    
    if (user) {
      if (!user.isConfirmed) {
        await sendConfirmationEmail(user);
        return res.status(400).json({ msg: 'Your account is pending Confirmation. Please check your email for further instructions.' , isConfirmed: false });
      } else if(!user.isApproved) {
        return res.status(403).json({ msg: 'Your account has not been approved yet. Please wait for approval.', isApproved: false });
      } else {
        return res.status(400).json({ msg: 'User already exists' });
      }
    }
    
    const isDcrustEmail= normalizedEmail? normalizedEmail.toLowerCase().includes('@dcrustm.org') : 'false';
    
    const isApproved=isDcrustEmail ?'approved':'pending';
    
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    
    user = new User({
      name,
      email: normalizedEmail,
      password,
      isApproved: isApproved,
      isConfirmed: false,
      confirmationToken,
      isAdmin: false
    });
    
    console.time('hashPassword');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.timeEnd('hashPassword');
    
    console.time('saveUser');
    await user.save();
    console.timeEnd('saveUser');
    console.log('User saved to database');
    const token =generateToken(user);
    console.time('sendEmail');
   
    await sendConfirmationEmail(user, confirmationToken);
    
    res.status(201).json({ success: true, message: 'Registration successful. Please check your email to confirm your account.', token });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
});

router.get('/confirm/:token', async (req, res) => {
  try {
    const user = await User.findOne({ confirmationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid confirmation token' });
    }

    user.isConfirmed = true;
    delete user.confirmationToken;
    await user.save();

    res.json({ msg: 'Account confirmed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/confirm-status/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ confirmed: user.isConfirmed });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);  
  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    console.log('Attempting to save user with reset token:', user);
    
    try {
      await user.save();
      console.log('User saved successfully with reset token');
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      return res.status(500).json({ msg: 'Error saving reset token' });
    }

    console.log('Reset token saved for user:', user.email, 'Token:', resetToken);

    // Send password reset email
    await sendPasswordResetEmail(user, resetToken);

    res.json({ msg: 'Password reset email sent' });
  } catch (err) {
    console.error('Error in forgot-password route:', err);
    res.status(500).send('Server error');
  }
});

router.put('/reset-password/:token', async (req, res) => {
  console.log('Reset password route hit', {
    params: req.params,
    body: req.body,
    url: req.url,
    method: req.method
  });
  const { token } = req.params; 
  const { password } = req.body;

  try {
    console.log('Reset password route hit inside try block');
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

  console.log('User found:', user);
console.log('Current time:', Date.now());

    if (!user) {
      console.log('No user found with token:', token);
      return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successful for user:', user.email);
    res.json({ msg: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login',async (req, res) => {
  try {
    const { email, password, captcha } = req.body;
    const normalizedEmail = normalizeEmail(email);

    // Verify CAPTCHA after credentials check
    if (!captcha) {
      return res.status(400).json({ msg: 'Please complete the CAPTCHA verification' });
    }
    try{
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    const captchaResponse = await axios.post(verifyURL, null, {
      params: {
        secret: secretKey,
        response: captcha
      }
    });

    console.log('reCAPTCHA response:', captchaResponse.data); 

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        success: false,
        msg: 'CAPTCHA verification failed',
        details: captchaResponse.data['error-codes']
      });
    }
  }catch(captchaError){
    console.error('CAPTCHA verification error:', captchaError);
    return res.status(400).json({
      success: false,
      msg: 'CAPTCHA verification failed'
    });
  }

  // Find user by email first
  const user = await User.findOne({ email:normalizedEmail });
  if (!user) {
    return res.status(400).json({ msg: 'Invalid Credentials' });
  }

  if (!user?.isConfirmed) {
    await sendConfirmationEmail(user);
    return res.status(400).json({ msg: 'Your account is pending confirmation. Please check your email for further instructions.' });
  }

  if (!user?.isApproved) {
    return res.status(403).json({ msg: 'Your account has not been approved yet. Please wait for approval.' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid Credentials' });
  }

    // Create and send token
    const token = await generateToken(user);
    res.json({ success:true,token ,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin || false
      }
    });
  } catch (err) {
    console.error(err.message);
    
    res.status(500).send('Server error');
  }
});


router.post('/refresh-token', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const payload = {
      user: {
        id: user._id,
        username: user.name,
        isAdmin : user.isAdmin || false
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;