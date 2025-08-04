class EZChainWallet {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000';
        this.refreshInterval = null;
        this.isConnected = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startBalanceRefresh();
        this.updateConnectionStatus();
    }

    setupEventListeners() {
        // 转账表单提交
        document.getElementById('transferForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransfer();
        });

        // 复制地址按钮
        document.getElementById('copyAddress').addEventListener('click', () => {
            this.copyAddress();
        });
    }

    async updateConnectionStatus() {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');

        try {
            await this.fetchBalance();
            this.isConnected = true;
            statusDot.className = 'status-dot connected';
            statusText.textContent = '已连接';
        } catch (error) {
            this.isConnected = false;
            statusDot.className = 'status-dot disconnected';
            statusText.textContent = '连接失败';
        }
    }

    async fetchBalance() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/balance`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.updateAccountInfo(data);
            return data;
        } catch (error) {
            console.error('获取余额失败:', error);
            throw error;
        }
    }

    updateAccountInfo(data) {
        const addressElement = document.getElementById('accountAddress');
        const balanceElement = document.getElementById('accountBalance');
        const lastUpdateElement = document.getElementById('lastUpdate');

        if (data.address) {
            addressElement.textContent = data.address;
        }
        
        if (data.balance !== undefined) {
            balanceElement.textContent = `${data.balance} EZC`;
        }

        lastUpdateElement.textContent = new Date().toLocaleString('zh-CN');
    }

    async handleTransfer() {
        const form = document.getElementById('transferForm');
        const transferBtn = document.getElementById('transferBtn');
        
        const formData = new FormData(form);
        const transferData = {
            recipientAddress: formData.get('recipientAddress').trim(),
            amount: parseFloat(formData.get('amount')),
            fee: formData.get('fee') ? parseFloat(formData.get('fee')) : 0
        };

        // 验证输入
        if (!this.validateTransferInput(transferData)) {
            return;
        }

        // 禁用按钮并显示加载状态
        transferBtn.disabled = true;
        transferBtn.innerHTML = '<span class="loading"></span> 处理中...';

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transferData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showMessage('转账成功！', 'success');
                form.reset();
                // 立即刷新余额
                await this.fetchBalance();
            } else {
                this.showMessage(result.message || '转账失败', 'error');
            }
        } catch (error) {
            console.error('转账失败:', error);
            this.showMessage('网络错误，请检查连接', 'error');
        } finally {
            // 恢复按钮状态
            transferBtn.disabled = false;
            transferBtn.textContent = '转账';
        }
    }

    validateTransferInput(data) {
        if (!data.recipientAddress) {
            this.showMessage('请输入收款人地址', 'error');
            return false;
        }

        if (!data.amount || data.amount <= 0) {
            this.showMessage('请输入有效的转账金额', 'error');
            return false;
        }

        if (data.fee < 0) {
            this.showMessage('手续费不能为负数', 'error');
            return false;
        }

        // 简单的地址格式验证
        if (data.recipientAddress.length < 10) {
            this.showMessage('收款人地址格式不正确', 'error');
            return false;
        }

        return true;
    }

    copyAddress() {
        const addressElement = document.getElementById('accountAddress');
        const address = addressElement.textContent;

        if (address && address !== '加载中...') {
            navigator.clipboard.writeText(address).then(() => {
                this.showMessage('地址已复制到剪贴板', 'success');
            }).catch(() => {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = address;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showMessage('地址已复制到剪贴板', 'success');
            });
        } else {
            this.showMessage('地址不可用', 'error');
        }
    }

    showMessage(text, type = 'info') {
        const container = document.getElementById('messageContainer');
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        container.appendChild(message);

        // 3秒后自动移除消息
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    startBalanceRefresh() {
        // 立即获取一次余额
        this.fetchBalance().catch(() => {
            // 初始获取失败时不显示错误，等待定时重试
        });

        // 每2秒刷新一次
        this.refreshInterval = setInterval(() => {
            this.fetchBalance().catch((error) => {
                console.error('自动刷新余额失败:', error);
                // 不显示错误消息，避免频繁打扰用户
            });
        }, 2000);
    }

    stopBalanceRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// 页面加载完成后初始化钱包
document.addEventListener('DOMContentLoaded', () => {
    window.wallet = new EZChainWallet();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.wallet) {
        window.wallet.stopBalanceRefresh();
    }
});