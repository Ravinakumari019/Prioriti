const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  exportTasksReport,
  exportUsersReport
} = require('../controllers/reportController');
const router = express.Router();

router.get('/export/tasks', protect, adminOnly, exportTasksReport); // Export all tasks as an Excel file
router.get('/export/users', protect, adminOnly, exportUsersReport); // Export user-task

module.exports = router;
