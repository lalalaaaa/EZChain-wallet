const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 模拟区块链数据
let blockchainData = {
    address: 'ezc1testaddress1234567890abcdefghijklmnopqrstuvwxyz',
    balance: 1000.5,
    transactions: []
};

// API路由
app.get('/api/balance', (req, res) => {
    // 模拟余额波动
    const fluctuation = (Math.random() - 0.5) * 0.1;
    blockchainData.balance += fluctuation;
    blockchainData.balance = Math.max(0, blockchainData.balance);

    res.json({
        address: blockchainData.address,
        balance: parseFloat(blockchainData.balance.toFixed(8))
    });
});

app.post('/api/transfer', (req, res) => {
    const { recipientAddress, amount, fee = 0 } = req.body;

    // 验证输入
    if (!recipientAddress || !amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: '无效的转账参数'
        });
    }

    if (amount + fee > blockchainData.balance) {
        return res.status(400).json({
            success: false,
            message: '余额不足'
        });
    }

    // 模拟转账处理
    setTimeout(() => {
        blockchainData.balance -= (amount + fee);
        
        // 记录交易
        blockchainData.transactions.push({
            id: Date.now(),
            recipientAddress,
            amount,
            fee,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: '转账成功',
            transactionId: Date.now().toString()
        });
    }, 1000); // 模拟网络延迟
});

// 提供前端页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`EZChain Wallet API服务器运行在 http://localhost:${PORT}`);
    console.log(`前端页面: http://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n服务器正在关闭...');
    process.exit(0);
});