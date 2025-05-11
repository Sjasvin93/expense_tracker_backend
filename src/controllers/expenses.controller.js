// src/controllers/expenses.controller.js

const Expense = require('../models/expenses.model');
const excelJS = require('exceljs');

// Create a new expense
const createExpense = async (req, res) => {
  try {
    const {user_id} = req.user;
    const { icon, category, amount, date } = req.body;

    const newExpense = new Expense({
      userId: user_id,
      icon,
      category,
      amount,
      date,
    });

    await newExpense.save();

    res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Failed to create expense', error: error.message });
  }
};

// Get all expenses (optionally filter by userId)
const getAllExpenses = async (req, res) => {
  try {
    const { userId } = req.query;

    const query = userId ? { userId } : {};

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
};

// Delete an expense by ID
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
};

// Download expenses as Excel for a user
const downloadExpensesExcel = async (req, res) => {
  try {
    const { user_id } = req.user;
    const userId = user_id;

    const expenses = await Expense.find({ userId });

    if (!expenses.length) {
      return res.status(404).json({ message: 'No expenses found for this user' });
    }

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expenses');

    worksheet.columns = [
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Icon', key: 'icon', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
    ];

    expenses.forEach((expense) => {
      worksheet.addRow({
        category: expense.category,
        icon: expense.icon,
        amount: expense.amount,
        date: expense.date.toISOString().split('T')[0], // Optional formatting
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=expenses_${userId}.xlsx`
    );

    await workbook.xlsx.write(res); // this ends the response
  } catch (error) {
    console.error('Error downloading expenses Excel:', error);
    res.status(500).json({ message: 'Failed to download Excel', error: error.message });
  }
};


module.exports = {
  createExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpensesExcel,
};
