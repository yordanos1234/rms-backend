const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { validators, validatePartial } = require('../middleware/validate');
const router = express.Router();

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') query.user = req.user.id;
    const students = await Student.find(query).populate('user', '-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students', type: 'SERVER_ERROR' });
  }
});

// Get single student
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', '-password');
    if (!student) return res.status(404).json({ message: 'Student not found', type: 'NOT_FOUND' });
    if (req.user.role === 'student' && student.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied', type: 'FORBIDDEN' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student', type: 'SERVER_ERROR' });
  }
});

// Create student (registrar/admin)
router.post('/', auth, authorize('registrar', 'admin'), validators.studentCreate, async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.body.user);
    if (!user) return res.status(404).json({ message: 'User not found', type: 'NOT_FOUND' });
    // Check if student already exists for this user
    const existing = await Student.findOne({ user: req.body.user });
    if (existing) return res.status(400).json({ message: 'Student record already exists for this user', type: 'DUPLICATE_ERROR' });

    const student = new Student(req.body);
    await student.save();
    const populated = await Student.findById(student._id).populate('user', '-password');
    res.status(201).json({ message: 'Student created successfully', student: populated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create student', type: 'SERVER_ERROR' });
  }
});

// Update student
router.put('/:id', auth, authorize('registrar', 'admin', 'student'), validatePartial(validators.studentCreate), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found', type: 'NOT_FOUND' });

    if (req.user.role === 'student' && student.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied', type: 'FORBIDDEN' });
    }

    // Students can only update certain fields
    if (req.user.role === 'student') {
      const allowed = ['phone'];
      Object.keys(req.body).forEach(k => { if (!allowed.includes(k)) delete req.body[k]; });
    }

    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('user', '-password');
    res.json({ message: 'Student updated successfully', student: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update student', type: 'SERVER_ERROR' });
  }
});

// Delete student (registrar/admin only)
router.delete('/:id', auth, authorize('registrar', 'admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found', type: 'NOT_FOUND' });
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete student', type: 'SERVER_ERROR' });
  }
});

module.exports = router;
