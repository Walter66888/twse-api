// server.js - 主程式
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cron = require('node-cron');
const mongoose = require('mongoose');
const { fetchTwseData } = require('./services/twseService');
const stockRoutes = require('./routes/stockRoutes');

// 初始化Express應用
const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());

// 連接到MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/twse-api')
  .then(() => console.log('MongoDB連接成功'))
  .catch(err => console.error('MongoDB連接失敗:', err));

// 載入Swagger文檔
const swaggerDocument = YAML.load('./swagger.yaml');

// 設置API路由
app.use('/api/stocks', stockRoutes);

// 設置Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 首頁路由
app.get('/', (req, res) => {
  res.send('台灣證券交易所API服務');
});

// 設置定時任務 - 每天8:45執行
cron.schedule('45 8 * * 1-5', async () => {
  console.log('執行8:45定時更新...');
  try {
    await fetchTwseData();
    console.log('資料更新成功!');
  } catch (error) {
    console.error('資料更新失敗:', error);
  }
}, {
  timezone: "Asia/Taipei"
});

// 設置定時任務 - 每天13:30執行
cron.schedule('30 13 * * 1-5', async () => {
  console.log('執行13:30定時更新...');
  try {
    await fetchTwseData();
    console.log('資料更新成功!');
  } catch (error) {
    console.error('資料更新失敗:', error);
  }
}, {
  timezone: "Asia/Taipei"
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`服務器運行在 http://localhost:${PORT}`);
  console.log(`API文檔可在 http://localhost:${PORT}/api-docs 查看`);
});
