const express = require('express');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');
const { validators } = require('../middleware/validate');
const router = express.Router();

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email').sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', type: 'SERVER_ERROR' });
  }
});

// Get single course
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found', type: 'NOT_FOUND' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course', type: 'SERVER_ERROR' });
  }
});

// Create course (admin/department_head/registrar)
router.post('/', auth, authorize('admin', 'department_head', 'registrar'), validators.courseCreate, async (req, res) => {
  try {
    // Check duplicate course code
    const existing = await Course.findOne({ courseCode: req.body.courseCode });
    if (existing) return res.status(400).json({ message: 'Course code already exists', field: 'courseCode', type: 'DUPLICATE_ERROR' });

    const course = new Course(req.body);
    await course.save();
    const populated = await Course.findById(course._id).populate('instructor', 'name email');
    res.status(201).json({ message: 'Course created successfully', course: populated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course', type: 'SERVER_ERROR' });
  }
});

// Update course
router.put('/:id', auth, authorize('admin', 'department_head', 'registrar'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found', type: 'NOT_FOUND' });
    // Check for duplicate course code if changing
    if (req.body.courseCode && req.body.courseCode !== course.courseCode) {
      const existing = await Course.findOne({ courseCode: req.body.courseCode });
      if (existing) return res.status(400).json({ message: 'Course code already exists', field: 'courseCode', type: 'DUPLICATE_ERROR' });
    }
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('instructor', 'name email');
    res.json({ message: 'Course updated successfully', course: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course', type: 'SERVER_ERROR' });
  }
});

// Delete course
router.delete('/:id', auth, authorize('admin', 'registrar'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found', type: 'NOT_FOUND' });
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', type: 'SERVER_ERROR' });
  }
});

module.exports = router;
