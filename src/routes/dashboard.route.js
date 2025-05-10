// src/routes/dashboard.route.js

const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');

// Route for fetching dashboard data
router.get('/', DashboardController.getDashboardData);

module.exports = router;
