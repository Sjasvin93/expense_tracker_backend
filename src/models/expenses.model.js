// src/models/expenses.model.js

const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }  
});

const Expense = mongoose.model('Expense', expensesSchema);
module.exports = Expense;
