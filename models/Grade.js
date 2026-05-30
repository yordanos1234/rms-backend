const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marks: {
    midterm: { type: Number, default: 0 },
    assignment: { type: Number, default: 0 },
    final: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  grade: { type: String, enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'NG'], default: 'NG' },
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected'], default: 'draft' },
  remarks: { type: String },
  submittedAt: { type: Date },
  approvedAt: { type: Date }
});

module.exports = mongoose.model('Grade', gradeSchema);
