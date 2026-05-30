const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, required: true, unique: true },
  program: { type: String, required: true },
  year: { type: Number, default: 1 },
  semester: { type: Number, default: 1 },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'graduated', 'suspended', 'withdrawn'], default: 'active' },
  gpa: { type: Number, default: 0 }
});

module.exports = mongoose.model('Student', studentSchema);
