const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: String, required: true },
  year: { type: Number, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['enrolled', 'completed', 'dropped', 'withdrawn'], default: 'enrolled' }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
