// services/twseService.js - 台灣證券交易所數據服務
const axios = require('axios');
const StockData = require('../models/stockData');

/**
 * 格式化日期為指定格式
 * @param {Date} date - 日期物件
 * @param {string} format - 格式 (e.g., 'yyyyMMdd')
 * @returns {string} 格式化後的日期字串
 */
function formatDate(date, format = 'yyyyMMdd') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  if (format === 'yyyyMMdd') {
    return `${year}${month}${day}`;
  }
  
  return `${year}-${month}-${day}`;
}

/**
 * 從台灣證券交易所獲取數據
 * @param {string} [dateStr=null] - 可選的日期字串，如果不提供則使用當前日期
 * @returns {Promise<Array>} 處理後的數據
 */
async function fetchTwseData(dateStr = null) {
  try {
    const date = dateStr ? new Date(dateStr) : new Date();
    const formattedDate = formatDate(date);
    
    const url = `https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=${formattedDate}`;
    console.log(`正在獲取數據，URL: ${url}`);
    
    const response = await axios.get(url);
    const data = response.data;
    
    if (!data || !data.data || data.data.length === 0) {
      console.log('沒有可用數據');
      return [];
    }
    
    console.log(`獲取到 ${data.data.length} 條數據記錄`);
    
    // 將數據保存到數據庫
    const savePromises = data.data.map(async (row) => {
      const stockData = {
        date: row[0],
        tradeVolume: row[1],
        tradeValue: row[2],
        transaction: row[3],
        index: row[4],
        change: row[5],
        source: 'FMTQIK',
        sourceUrl: url,
        updatedAt: new Date()
      };
      
      // 使用upsert操作 - 如果記錄存在則更新，不存在則創建
      await StockData.findOneAndUpdate(
        { date: stockData.date, source: stockData.source },
        stockData,
        { upsert: true, new: true }
      );
    });
    
    await Promise.all(savePromises);
    return data.data;
    
  } catch (error) {
    console.error('獲取TWSE數據時出錯:', error.message);
    throw error;
  }
}

/**
 * 獲取已保存的股票數據
 * @param {Object} query - 查詢條件
 * @returns {Promise<Array>} 數據庫中的股票數據
 */
async function getStockData(query = {}) {
  try {
    return await StockData.find(query).sort({ date: -1 });
  } catch (error) {
    console.error('獲取數據庫數據時出錯:', error.message);
    throw error;
  }
}

module.exports = {
  fetchTwseData,
  getStockData,
  formatDate
};
