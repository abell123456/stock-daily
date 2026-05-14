// 股票分析网站主逻辑
document.addEventListener('DOMContentLoaded', function() {
    initWebsite();
    loadStockData();
    updateUI();
    setInterval(updateTime, 1000);
});

// 初始化网站
function initWebsite() {
    console.log('股票分析网站初始化...');
    
    // 设置页面标题
    document.title = `股票分析 - ${new Date().toLocaleDateString('zh-CN')}`;
    
    // 初始化工具提示
    initTooltips();
    
    // 初始化滚动动画
    initScrollAnimation();
}

// 加载股票数据
function loadStockData() {
    if (!window.stockData || !window.stockUtils) {
        console.error('股票数据未加载');
        return;
    }
    
    const data = window.stockData;
    const utils = window.stockUtils;
    
    // 更新统计数据
    const stats = utils.calculateStats();
    updateStats(stats);
    
    // 更新市场分析
    updateMarketAnalysis(data.marketSummary);
    
    // 更新关键洞察
    updateKeyInsights(data.keyInsights);
    
    // 更新股票表格
    updateStockTable(data.stocks);
    
    // 更新投资建议
    updateRecommendations(data.recommendations, data.riskWarnings, data.tomorrowOutlook);
    
    // 更新最后更新时间
    updateLastUpdateTime(data.lastUpdate);
    
    console.log('股票数据加载完成');
}

// 更新统计数据
function updateStats(stats) {
    document.getElementById('total-change').textContent = `${stats.totalChange > 0 ? '+' : ''}${stats.totalChange}%`;
    document.getElementById('stock-count').textContent = stats.stockCount;
    document.getElementById('recommendation-score').textContent = `${stats.recommendationScore}%`;
    
    // 设置颜色
    const totalChangeElem = document.getElementById('total-change');
    if (stats.totalChange > 0) {
        totalChangeElem.className = 'stat-value positive';
    } else if (stats.totalChange < 0) {
        totalChangeElem.className = 'stat-value negative';
    } else {
        totalChangeElem.className = 'stat-value neutral';
    }
}

// 更新市场分析
function updateMarketAnalysis(summary) {
    const summaryElem = document.getElementById('market-summary');
    if (summaryElem) {
        summaryElem.innerHTML = `<p>${summary}</p>`;
    }
}

// 更新关键洞察
function updateKeyInsights(insights) {
    const insightsElem = document.getElementById('key-insights');
    if (!insightsElem) return;
    
    insightsElem.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <i class="fas fa-lightbulb"></i>
            <p>${insight}</p>
        </div>
    `).join('');
}

// 更新股票表格
function updateStockTable(stocks) {
    const tableBody = document.getElementById('stock-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = stocks.map(stock => {
        const changeClass = window.stockUtils.getChangeClass(stock.dailyChange);
        const trendIcon = window.stockUtils.getTrendIcon(stock.trend);
        const changeText = window.stockUtils.formatPercent(stock.dailyChange);
        const volumeText = window.stockUtils.formatNumber(stock.volume);
        
        return `
            <tr>
                <td><strong>${stock.symbol}</strong></td>
                <td>${stock.name}</td>
                <td>$${stock.currentPrice.toFixed(2)}</td>
                <td class="${changeClass}">
                    <i class="${trendIcon}"></i>
                    ${changeText}
                </td>
                <td>${volumeText}</td>
                <td>$${stock.high.toFixed(2)}</td>
                <td>$${stock.low.toFixed(2)}</td>
                <td>
                    <span class="stock-status ${changeClass}">
                        ${stock.dailyChange > 0 ? '上涨' : stock.dailyChange < 0 ? '下跌' : '平盘'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-outline" onclick="viewStockDetail('${stock.symbol}')">
                        <i class="fas fa-chart-line"></i> 详情
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 更新投资建议
function updateRecommendations(recommendations, riskWarnings, tomorrowOutlook) {
    // 更新推荐关注
    const recElem = document.getElementById('recommendations');
    if (recElem) {
        recElem.innerHTML = recommendations.map(rec => `<p>• ${rec}</p>`).join('');
    }
    
    // 更新风险提示
    const riskElem = document.getElementById('risk-warnings');
    if (riskElem) {
        riskElem.innerHTML = riskWarnings.map(warning => `<p>⚠️ ${warning}</p>`).join('');
    }
    
    // 更新明日展望
    const outlookElem = document.getElementById('tomorrow-outlook');
    if (outlookElem) {
        outlookElem.innerHTML = tomorrowOutlook.map(outlook => `<p>• ${outlook}</p>`).join('');
    }
}

// 更新最后更新时间
function updateLastUpdateTime(timestamp) {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // 更新多个位置的时间显示
    const elements = [
        document.getElementById('update-time'),
        document.getElementById('last-update-time'),
        document.getElementById('footer-update-time')
    ];
    
    elements.forEach(elem => {
        if (elem) elem.textContent = timeStr;
    });
}

// 更新UI
function updateUI() {
    // 更新导航栏活跃状态
    updateNavActiveState();
    
    // 添加动画效果
    addAnimations();
    
    // 初始化图表（延迟执行确保DOM完全加载）
    setTimeout(() => {
        if (window.stockCharts && window.stockCharts.initCharts) {
            window.stockCharts.initCharts();
        }
    }, 500);
}

// 更新导航栏活跃状态
function updateNavActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(section => observer.observe(section));
}

// 添加动画效果
function addAnimations() {
    // 添加滚动动画
    const animateElements = document.querySelectorAll('.stat-card, .insight-item, .feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(elem => {
        elem.style.opacity = '0';
        elem.style.transform = 'translateY(20px)';
        elem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(elem);
    });
}

// 初始化工具提示
function initTooltips() {
    // 这里可以添加工具提示初始化逻辑
    console.log('工具提示初始化完成');
}

// 初始化滚动动画
function initScrollAnimation() {
    // 这里可以添加滚动动画初始化逻辑
    console.log('滚动动画初始化完成');
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const updateTimeElem = document.getElementById('update-time');
    if (updateTimeElem) {
        updateTimeElem.textContent = `最后更新: ${timeStr}`;
    }
}

// 查看股票详情（示例函数）
function viewStockDetail(symbol) {
    alert(`查看 ${symbol} 的详细分析\n功能开发中...`);
    
    // 这里可以添加跳转到详细页面的逻辑
    // window.location.href = `stock-detail.html?symbol=${symbol}`;
}

// 刷新数据
function refreshData() {
    console.log('刷新股票数据...');
    
    // 显示加载状态
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
        refreshBtn.disabled = true;
    }
    
    // 模拟数据刷新
    setTimeout(() => {
        // 重新加载数据
        loadStockData();
        
        // 恢复按钮状态
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 刷新数据';
            refreshBtn.disabled = false;
        }
        
        // 显示成功消息
        showNotification('数据刷新成功！', 'success');
    }, 1500);
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// 添加通知样式
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification button {
        background: none;
        border: none;
        cursor: pointer;
        color: #64748b;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// 导出函数
window.stockApp = {
    refreshData,
    viewStockDetail,
    showNotification
};