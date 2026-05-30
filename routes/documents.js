const express = require('express');
const DocumentRequest = require('../models/DocumentRequest');
const { auth, authorize } = require('../middleware/auth');
const { validators, validatePartial } = require('../middleware/validate');
const router = express.Router();

// Get all document requests
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      const student = await require('../models/Student').findOne({ user: req.user.id });
      if (student) query.student = student._id;
    }
    const docs = await DocumentRequest.find(query).populate('student').populate('processedBy', 'name').sort({ requestedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents', type: 'SERVER_ERROR' });
  }
});

// Get single document
router.get('/:id', auth, async (req, res) => {
  try {
    const doc = await DocumentRequest.findById(req.params.id).populate('student').populate('processedBy', 'name');
    if (!doc) return res.status(404).json({ message: 'Document not found', type: 'NOT_FOUND' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch document', type: 'SERVER_ERROR' });
  }
});

// Create document request (student)
router.post('/', auth, authorize('student'), validators.docCreate, async (req, res) => {
  try {
    const student = await require('../models/Student').findOne({ user: req.user.id });
    if (!student) return res.status(400).json({ message: 'Student profile not found. Please contact registrar.', type: 'NOT_FOUND' });
    // Check for duplicate pending request of same type
    const existing = await DocumentRequest.findOne({ student: student._id, type: req.body.type, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'You already have a pending request for this document type', type: 'DUPLICATE_ERROR' });

    const docReq = new DocumentRequest({ ...req.body, student: student._id });
    await docReq.save();
    res.status(201).json({ message: 'Document requested successfully', document: docReq });
  } catch (err) {
    res.status(500).json({ message: 'Failed to request document', type: 'SERVER_ERROR' });
  }
});

// Update document request (registrar/admin)
router.put('/:id', auth, authorize('registrar', 'admin'), validatePartial(validators.docCreate), async (req, res) => {
  try {
    const doc = await DocumentRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document request not found', type: 'NOT_FOUND' });
    // Validate status
    if (req.body.status && !['pending','processing','ready','delivered','rejected'].includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status value', type: 'VALIDATION_ERROR' });
    }
    req.body.processedBy = req.user.id;
    req.body.processedAt = new Date();
    const updated = await DocumentRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('student').populate('processedBy', 'name');
    res.json({ message: 'Document status updated successfully', document: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update document', type: 'SERVER_ERROR' });
  }
});

// Delete document request (admin/registrar)
router.delete('/:id', auth, authorize('admin', 'registrar'), async (req, res) => {
  try {
    const doc = await DocumentRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document request not found', type: 'NOT_FOUND' });
    await DocumentRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete document', type: 'SERVER_ERROR' });
  }
});

module.exports = router;
