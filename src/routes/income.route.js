// src/routes/income.route.js

const express = require('express');
const router = express.Router();
const Controller = require('../controllers/income.controller');

// Create new income
router.post('/income', Controller.createIncome);

// Get all incomes (optionally filter by userId)
router.get('/income', Controller.getAllIncomes);

// Delete income by ID
router.delete('/income/:id', Controller.deleteIncome);

// Download incomes as Excel file (for a user)
router.get('/income/download/:userId', Controller.downloadIncomeExcel);

module.exports = router;
