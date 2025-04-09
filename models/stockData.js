// models/stockData.js - 股票數據模型
const mongoose = require('mongoose');

const stockDataSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    index: true
  },
  tradeVolume: {
    type: String,
    required: true
  },
  tradeValue: {
    type: String,
    required: true
  },
  transaction: {
    type: String,
    required: true
  },
  index: {
    type: String,
    required: true
  },
  change: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'FMTQIK',
    required: true
  },
  sourceUrl: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 複合索引，確保每個日期和數據源的組合是唯一的
stockDataSchema.index({ date: 1, source: 1 }, { unique: true });

const StockData = mongoose.model('StockData', stockDataSchema);

module.exports = StockData;
