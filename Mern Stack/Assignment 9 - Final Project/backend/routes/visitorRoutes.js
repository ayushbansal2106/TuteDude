const express = require('express');
const router = express.Router();
const { getVisitors, addVisitor, updateVisitorStatus } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware'); // <--- Import this

// Wrap the routes with 'protect'
router.route('/')
    .get(protect, getVisitors)   // Only logged in users can see visitors
    .post(protect, addVisitor);  // Only logged in users can add visitors

router.route('/:id').put(protect, updateVisitorStatus); // Only logged in users can update

module.exports = router;