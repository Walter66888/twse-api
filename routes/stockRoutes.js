// routes/stockRoutes.js - API路由
const express = require('express');
const { getStockData, fetchTwseData } = require('../services/twseService');
const router = express.Router();

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: 獲取所有股票數據
 *     description: 返回所有已保存的台灣證券交易所數據
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockData'
 */
router.get('/', async (req, res) => {
  try {
    const data = await getStockData();
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取數據失敗',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/stocks/latest:
 *   get:
 *     summary: 獲取最新股票數據
 *     description: 返回最新的台灣證券交易所數據
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/StockData'
 */
router.get('/latest', async (req, res) => {
  try {
    const data = await getStockData();
    const latest = data && data.length > 0 ? data[0] : null;
    
    res.json({
      success: true,
      data: latest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取最新數據失敗',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/stocks/refresh:
 *   post:
 *     summary: 手動刷新股票數據
 *     description: 從台灣證券交易所手動獲取最新數據
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: 可選的日期 (格式: YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/refresh', async (req, res) => {
  try {
    const { date } = req.query;
    await fetchTwseData(date);
    
    res.json({
      success: true,
      message: '數據已成功更新'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '刷新數據失敗',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/stocks/date/{date}:
 *   get:
 *     summary: 獲取特定日期的股票數據
 *     description: 根據日期返回台灣證券交易所數據
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: 日期 (格式: YYYY-MM-DD 或 台灣證券交易所格式)
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/StockData'
 */
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const data = await getStockData({ date: date });
    
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: `找不到日期 ${date} 的數據`
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取數據失敗',
      error: error.message
    });
  }
});

module.exports = router;
