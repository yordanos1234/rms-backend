const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validators } = require('../middleware/validate');
const router = express.Router();

// Register
router.post('/register', validators.register, async (req, res) => {
  try {
    const { name, email, password, role, department, institution, phone } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists', field: 'email', type: 'DUPLICATE_ERROR' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role, department, institution, phone });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'rmssecretkey', { expiresIn: '24h' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed. Please try again.', type: 'SERVER_ERROR' });
  }
});

// Login
router.post('/login', validators.login, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password', type: 'AUTH_ERROR' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password', type: 'AUTH_ERROR' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'rmssecretkey', { expiresIn: '24h' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed. Please try again.', type: 'SERVER_ERROR' });
  }
});

module.exports = router;
