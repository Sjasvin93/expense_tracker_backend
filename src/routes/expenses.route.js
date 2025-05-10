// src/routes/expenses.route.js

const express = require('express');
const router = express.Router();
const ExpensesController = require('../controllers/expenses.controller');

router.post('/create-expense', ExpensesController.createExpense);

router.get('/get-all-expenses', ExpensesController.getAllExpenses);

router.delete('/delete-expense/:id', ExpensesController.deleteExpense);

router.get('/download-expenses/:userId', ExpensesController.downloadExpensesExcel);

module.exports = router;
