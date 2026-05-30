const express = require('express');
const Grade = require('../models/Grade');
const { auth, authorize } = require('../middleware/auth');
const { validators, validatePartial } = require('../middleware/validate');
const router = express.Router();

// Get all grades
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      const student = await require('../models/Student').findOne({ user: req.user.id });
      if (student) query.student = student._id;
    } else if (req.user.role === 'instructor') {
      query.instructor = req.user.id;
    }
    const grades = await Grade.find(query).populate('student').populate('course').populate('instructor', 'name').sort({ submittedAt: -1 });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch grades', type: 'SERVER_ERROR' });
  }
});

// Get single grade
router.get('/:id', auth, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate('student').populate('course').populate('instructor', 'name');
    if (!grade) return res.status(404).json({ message: 'Grade not found', type: 'NOT_FOUND' });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch grade', type: 'SERVER_ERROR' });
  }
});

// Create/Submit grade (instructor)
router.post('/', auth, authorize('instructor', 'registrar', 'admin'), validators.gradeCreate, async (req, res) => {
  try {
    const gradeData = { ...req.body, instructor: req.user.id, status: 'submitted', submittedAt: new Date() };
    const grade = new Grade(gradeData);
    await grade.save();
    const populated = await Grade.findById(grade._id).populate('student').populate('course').populate('instructor', 'name');
    res.status(201).json({ message: 'Grade submitted successfully', grade: populated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit grade', type: 'SERVER_ERROR' });
  }
});

// Update grade (instructor for draft, registrar for approval)
router.put('/:id', auth, validatePartial(validators.gradeCreate), async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found', type: 'NOT_FOUND' });

    if (req.user.role === 'instructor' && grade.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied', type: 'FORBIDDEN' });
    }

    if (req.user.role === 'registrar' || req.user.role === 'admin') {
      req.body.approvedAt = new Date();
    }

    const updated = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('student').populate('course').populate('instructor', 'name');
    res.json({ message: 'Grade updated successfully', grade: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update grade', type: 'SERVER_ERROR' });
  }
});

// Delete grade (admin/registrar)
router.delete('/:id', auth, authorize('admin', 'registrar'), async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found', type: 'NOT_FOUND' });
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grade deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete grade', type: 'SERVER_ERROR' });
  }
});

module.exports = router;
