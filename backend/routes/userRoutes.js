const express = require('express');
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const {getUsers,getUserById } = require('../controllers/userController');

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users admin only
router.get("/:id", protect, getUserById); // Get user by ID


module.exports = router;
