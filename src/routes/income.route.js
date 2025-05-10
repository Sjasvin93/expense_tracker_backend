// src/routes/income.route.js

const express = require('express');
const router = express.Router();
const Controller = require('../controllers/income.controller');
const {authenticateUser} = require("../middlewares/auth.middleware")

// Create new income
router.post('/create-income', authenticateUser, Controller.createIncome);

// Get all incomes (optionally filter by userId)
router.get('/get-all-income', authenticateUser, Controller.getAllIncomes);

// Delete income by ID
router.delete('/delete-income/:id', authenticateUser, Controller.deleteIncome);

// Download incomes as Excel file (for a user)
router.get('/download-income/', authenticateUser, Controller.downloadIncomeExcel);

module.exports = router;
