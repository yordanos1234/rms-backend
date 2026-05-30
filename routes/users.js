const express = require('express');
const User = require('../models/User');
const Student = require('../models/Student');
const { auth, authorize } = require('../middleware/auth');
const { validators } = require('../middleware/validate');
const router = express.Router();

// Get all users (admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', type: 'SERVER_ERROR' });
  }
});

// Get single user
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found', type: 'NOT_FOUND' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', type: 'SERVER_ERROR' });
  }
});

// Create user (admin only)
router.post('/', auth, authorize('admin'), validators.register, async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists', field: 'email', type: 'DUPLICATE_ERROR' });

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role, department, phone });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user: await User.findById(user._id).select('-password') });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', type: 'SERVER_ERROR' });
  }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied', type: 'FORBIDDEN' });
    }
    // Prevent non-admins from changing role
    if (req.user.role !== 'admin') {
      delete req.body.role;
      delete req.body.isActive;
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found', type: 'NOT_FOUND' });
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', type: 'SERVER_ERROR' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found', type: 'NOT_FOUND' });
    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account', type: 'VALIDATION_ERROR' });
    }
    // Also delete associated student record
    await Student.deleteOne({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', type: 'SERVER_ERROR' });
  }
});

module.exports = router;
