# EZChain Wallet

一个基于自研区块链后端的钱包Web客户端。

## 功能特性

- ✅ 账户信息实时显示（地址、余额）
- ✅ 转账功能（支持手续费设置）
- ✅ 每2秒自动刷新余额
- ✅ 响应式设计，支持移动端
- ✅ 完整的错误处理和用户反馈
- ✅ 一键复制地址功能

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
npm start
```

或使用开发模式（支持热重载）：

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问: http://localhost:3000

## API接口

### 获取账户信息
```
GET /api/balance
```

响应示例：
```json
{
  "address": "ezc1testaddress1234567890abcdefghijklmnopqrstuvwxyz",
  "balance": 1000.5
}
```

### 执行转账
```
POST /api/transfer
```

请求参数：
```json
{
  "recipientAddress": "ezc1recipientaddress...",
  "amount": 10.5,
  "fee": 0.01
}
```

响应示例：
```json
{
  "success": true,
  "message": "转账成功",
  "transactionId": "1234567890"
}
```

## 文件结构

```
ezchain_website/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 前端逻辑
├── server.js           # 后端API服务器
├── package.json        # 项目配置
├── prd.md             # 产品需求文档
└── README.md          # 说明文档
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Node.js, Express.js
- **样式**: 响应式设计，CSS Grid & Flexbox
- **特性**: 前后端分离，RESTful API

## 注意事项

1. 当前使用模拟数据进行演示
2. 实际部署时需要配置真实的区块链后端API
3. 建议在生产环境中添加HTTPS和身份验证
4. 可根据实际需求调整自动刷新间隔

## 开发说明

- 前端代码采用ES6 Class语法组织
- 支持现代浏览器（Chrome, Firefox, Safari, Edge）
- 移动端适配良好
- 包含完整的错误处理机制

## 许可证

MIT License