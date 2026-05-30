const mongoose = require('mongoose');

const documentRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { type: String, enum: ['transcript', 'enrollment_letter', 'certificate', 'clearance', 'id_card'], required: true },
  status: { type: String, enum: ['pending', 'processing', 'ready', 'delivered', 'rejected'], default: 'pending' },
  purpose: { type: String },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
});

module.exports = mongoose.model('DocumentRequest', documentRequestSchema);
