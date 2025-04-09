# 台灣證券交易所API服務

這是一個自動化獲取台灣證券交易所數據並提供OpenAPI格式的服務。

## 功能特點

- 定時從台灣證券交易所獲取最新數據
- 提供RESTful API存取數據
- 支持OpenAPI/Swagger格式
- 可擴展性設計，方便添加更多數據源
- 自動化數據更新（每天8:45和13:30）

## API端點

- `GET /api/stocks`: 獲取所有股票數據
- `GET /api/stocks/latest`: 獲取最新股票數據
- `POST /api/stocks/refresh`: 手動刷新股票數據
- `GET /api/stocks/date/{date}`: 獲取特定日期的股票數據

詳細API文檔可在運行服務後通過 `/api-docs` 訪問。

## 部署指南

### Render.com部署

1. 註冊/登入 [Render](https://render.com/)
2. 創建新的Web服務
3. 連接到GitHub倉庫
4. 設置環境變數（特別是`MONGODB_URI`）
5. 部署應用

### MongoDB Atlas設置

1. 註冊/登入 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 創建免費集群
3. 設置數據庫用戶和網絡訪問
4. 獲取連接字符串並放入環境變數

## 使用與ChatGPT集成

1. 在雲平台部署此服務
2. 在ChatGPT中創建自定義動作
3. 將OpenAPI端點（`https://your-domain.com/api-docs`）添加到動作中
4. 啟用動作並開始使用
