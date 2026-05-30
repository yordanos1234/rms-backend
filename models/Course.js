const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  credits: { type: Number, required: true },
  department: { type: String, required: true },
  description: { type: String },
  prerequisites: [{ type: String }],
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  semester: { type: String, required: true },
  year: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Course', courseSchema);
