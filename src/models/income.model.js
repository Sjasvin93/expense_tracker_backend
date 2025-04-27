const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // referring to 'User' model
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String, // Saving date as local string
      required: true,
    },
  },
  { timestamps: true }
);

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
