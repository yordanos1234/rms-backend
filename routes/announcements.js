const express = require('express');
const Announcement = require('../models/Announcement');
const { auth, authorize } = require('../middleware/auth');
const { validators, validatePartial } = require('../middleware/validate');
const router = express.Router();

// Get all announcements
router.get('/', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find().populate('postedBy', 'name role').sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements', type: 'SERVER_ERROR' });
  }
});

// Get single announcement
router.get('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('postedBy', 'name role');
    if (!announcement) return res.status(404).json({ message: 'Announcement not found', type: 'NOT_FOUND' });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcement', type: 'SERVER_ERROR' });
  }
});

// Create announcement (admin/registrar/department_head)
router.post('/', auth, authorize('admin', 'registrar', 'department_head'), validators.announcementCreate, async (req, res) => {
  try {
    const announcement = new Announcement({ ...req.body, postedBy: req.user.id });
    await announcement.save();
    const populated = await Announcement.findById(announcement._id).populate('postedBy', 'name role');
    res.status(201).json({ message: 'Announcement posted successfully', announcement: populated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post announcement', type: 'SERVER_ERROR' });
  }
});

// Update announcement (only by author or admin)
router.put('/:id', auth, validatePartial(validators.announcementCreate), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found', type: 'NOT_FOUND' });
    if (req.user.role !== 'admin' && announcement.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own announcements', type: 'FORBIDDEN' });
    }
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('postedBy', 'name role');
    res.json({ message: 'Announcement updated successfully', announcement: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update announcement', type: 'SERVER_ERROR' });
  }
});

// Delete announcement (only by author or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found', type: 'NOT_FOUND' });
    if (req.user.role !== 'admin' && announcement.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own announcements', type: 'FORBIDDEN' });
    }
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete announcement', type: 'SERVER_ERROR' });
  }
});

module.exports = router;
