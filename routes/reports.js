const express = require('express');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Grade = require('../models/Grade');
const DocumentRequest = require('../models/DocumentRequest');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Dashboard stats
router.get('/stats', auth, authorize('admin', 'registrar', 'department_head'), async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const pendingDocs = await DocumentRequest.countDocuments({ status: 'pending' });
    const activeStudents = await Student.countDocuments({ status: 'active' });
    const graduatedStudents = await Student.countDocuments({ status: 'graduated' });

    res.json({ totalStudents, totalCourses, totalEnrollments, pendingDocs, activeStudents, graduatedStudents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enrollment by department
router.get('/enrollment-by-dept', auth, authorize('admin', 'registrar', 'department_head'), async (req, res) => {
  try {
    const courses = await Course.find();
    const result = {};
    for (const course of courses) {
      const count = await Enrollment.countDocuments({ course: course._id });
      result[course.department] = (result[course.department] || 0) + count;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Recent document requests
router.get('/recent-docs', auth, authorize('admin', 'registrar'), async (req, res) => {
  try {
    const docs = await DocumentRequest.find().sort({ requestedAt: -1 }).limit(10).populate('student');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
