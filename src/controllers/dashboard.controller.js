// src/controllers/dashboard.controller.js

const mongoose = require('mongoose');
const Income = require('../models/income.model');
const Expense = require('../models/expenses.model');
const moment = require('moment');
const { sendApiResponse } = require('../config/api_response');

// Get Dashboard data
const getDashboardData = async (req, res) => {
  try {
    const { user_id } = req.user;
    console.log("USER==",user_id);
    
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id in query' });
    }

    // Convert user_id to ObjectId (if stored as ObjectId in MongoDB)
    const userId = user_id;
    console.log(userId);    

    // Total Income
    const totalIncome = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Total Expenses
    const totalExpenses = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Last Transaction
    const lastIncome = await Income.find({ userId }).sort({ date: -1 }).limit(1);
    const lastExpense = await Expense.find({ userId }).sort({ date: -1 }).limit(1);

    const lastTransaction =
      lastIncome[0] &&
      (!lastExpense[0] || moment(lastIncome[0].date).isAfter(lastExpense[0].date))
        ? lastIncome[0]
        : lastExpense[0];

    // Total Balance
    const totalBalance = (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0);

    // Last 30 Days Expenses
    const last30DaysExpenses = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: moment().subtract(30, 'days').toDate() },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          transactions: { $push: '$$ROOT' },
        },
      },
    ]);

    // Last 30 Days Income
    const last30DaysIncome = await Income.aggregate([
      {
        $match: {
          userId,
          date: { $gte: moment().subtract(30, 'days').toDate() },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          transactions: { $push: '$$ROOT' },
        },
      },
    ]);

    // Last 60 Days Income
    const last60DaysIncome = await Income.aggregate([
      {
        $match: {
          userId,
          date: { $gte: moment().subtract(60, 'days').toDate() },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          transactions: { $push: '$$ROOT' },
        },
      },
    ]);

    // Last 10 Recent Transactions (Income + Expenses)
    const recentExpenses = (
      await Expense.find({ userId }).sort({ date: -1 }).limit(10)
    ).map((txn) => ({
      ...txn.toObject(),
      type: 'expense',
    }));

    const recentIncomes = (
      await Income.find({ userId }).sort({ date: -1 }).limit(10)
    ).map((txn) => ({
      ...txn.toObject(),
      type: 'income',
    }));

    const combinedRecentTransactions = [...recentExpenses, ...recentIncomes]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    const data = {
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      lastTransaction,
      totalBalance,
      last30DaysExpenses: {
        total: last30DaysExpenses[0]?.total || 0,
        transactions: last30DaysExpenses[0]?.transactions || [],
      },
      last30DaysIncome: {
        total: last30DaysIncome[0]?.total || 0,
        transactions: last30DaysIncome[0]?.transactions || [],
      },
      last60DaysIncome: {
        total: last60DaysIncome[0]?.total || 0,
        transactions: last60DaysIncome[0]?.transactions || [],
      },
      recentTransactions: combinedRecentTransactions,
    };

    return sendApiResponse(res, 'Dashboard data fetched successfully', { data });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

module.exports = { getDashboardData };
