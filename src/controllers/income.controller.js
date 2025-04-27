// src/controllers/income.controller.js

const Income = require('../models/income.model');
const excelJS = require('exceljs');

// Create a new income
const createIncome = async (req, res) => {
  try {
    const { userId, icon, source, amount, date } = req.body;

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date,
    });

    await newIncome.save();

    res.status(201).json({ message: 'Income created successfully', income: newIncome });
  } catch (error) {
    console.error('Error creating income:', error);
    res.status(500).json({ message: 'Failed to create income', error: error.message });
  }
};

// Get all incomes (optionally filter by userId)
const getAllIncomes = async (req, res) => {
  try {
    const { userId } = req.query;

    const query = userId ? { userId } : {};

    const incomes = await Income.find(query).sort({ date: -1 });

    res.status(200).json({ incomes });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ message: 'Failed to fetch incomes', error: error.message });
  }
};

// Delete an income by ID
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ message: 'Failed to delete income', error: error.message });
  }
};

// Download incomes as Excel for a user
const downloadIncomeExcel = async (req, res) => {
  try {
    const { userId } = req.params;

    const incomes = await Income.find({ userId });

    if (!incomes.length) {
      return res.status(404).json({ message: 'No incomes found for this user' });
    }

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Incomes');

    worksheet.columns = [
      { header: 'Source', key: 'source', width: 30 },
      { header: 'Icon', key: 'icon', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
    ];

    incomes.forEach((income) => {
      worksheet.addRow({
        source: income.source,
        icon: income.icon,
        amount: income.amount,
        date: income.date,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=incomes_${userId}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error('Error downloading Excel:', error);
    res.status(500).json({ message: 'Failed to download Excel', error: error.message });
  }
};

module.exports = {
  createIncome,
  getAllIncomes,
  deleteIncome,
  downloadIncomeExcel,
};
