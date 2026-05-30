const express = require('express');
const Enrollment = require('../models/Enrollment');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all enrollments
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      const student = await require('../models/Student').findOne({ user: req.user.id });
      if (student) query.student = student._id;
    }
    const enrollments = await Enrollment.find(query).populate('student').populate('course').sort({ enrollmentDate: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrollments', type: 'SERVER_ERROR' });
  }
});

// Get single enrollment
router.get('/:id', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('student').populate('course');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found', type: 'NOT_FOUND' });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrollment', type: 'SERVER_ERROR' });
  }
});

// Create enrollment
router.post('/', auth, authorize('student', 'registrar', 'admin'), async (req, res) => {
  try {
    const { student, course } = req.body;
    // Check for duplicate enrollment
    const existing = await Enrollment.findOne({ student, course, status: { $ne: 'dropped' } });
    if (existing) return res.status(400).json({ message: 'Student is already enrolled in this course', type: 'DUPLICATE_ERROR' });

    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    const populated = await Enrollment.findById(enrollment._id).populate('student').populate('course');
    res.status(201).json({ message: 'Enrollment created successfully', enrollment: populated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create enrollment', type: 'SERVER_ERROR' });
  }
});

// Update enrollment
router.put('/:id', auth, authorize('registrar', 'admin'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found', type: 'NOT_FOUND' });
    const updated = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('student').populate('course');
    res.json({ message: 'Enrollment updated successfully', enrollment: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update enrollment', type: 'SERVER_ERROR' });
  }
});

// Delete enrollment
router.delete('/:id', auth, authorize('registrar', 'admin'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found', type: 'NOT_FOUND' });
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete enrollment', type: 'SERVER_ERROR' });
  }
});

module.exports = router;
