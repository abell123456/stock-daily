// 股票分析图表配置
document.addEventListener('DOMContentLoaded', function() {
    // 等待数据加载
    setTimeout(initCharts, 100);
});

function initCharts() {
    if (!window.stockData) {
        console.warn('股票数据未加载，等待重试...');
        setTimeout(initCharts, 500);
        return;
    }
    
    createChangeChart();
    createPriceChart();
}

// 创建涨跌幅对比图表
function createChangeChart() {
    const ctx = document.getElementById('changeChart');
    if (!ctx) return;
    
    const stocks = window.stockData.stocks;
    const labels = stocks.map(stock => stock.symbol);
    const changes = stocks.map(stock => stock.dailyChange);
    const colors = changes.map(change => 
        change > 0 ? '#10b981' : change < 0 ? '#ef4444' : '#64748b'
    );
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '涨跌幅 (%)',
                data: changes,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.8', '1')),
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const change = context.raw;
                            const sign = change >= 0 ? '+' : '';
                            return `${context.dataset.label}: ${sign}${change.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 创建价格分布图表
function createPriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;
    
    const stocks = window.stockData.stocks;
    const labels = stocks.map(stock => stock.symbol);
    const prices = stocks.map(stock => stock.currentPrice);
    const changes = stocks.map(stock => stock.dailyChange);
    
    // 根据涨跌设置颜色
    const backgroundColors = changes.map(change => {
        const opacity = Math.min(Math.abs(change) / 5, 0.8);
        return change > 0 
            ? `rgba(16, 185, 129, ${0.6 + opacity})`
            : change < 0 
            ? `rgba(239, 68, 68, ${0.6 + opacity})`
            : 'rgba(100, 116, 139, 0.6)';
    });
    
    const borderColors = changes.map(change => 
        change > 0 ? '#10b981' : change < 0 ? '#ef4444' : '#64748b'
    );
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '当前价格',
                    data: prices,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: borderColors,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toFixed(2)}`;
                        },
                        afterLabel: function(context) {
                            const stock = stocks[context.dataIndex];
                            const sign = stock.dailyChange >= 0 ? '+' : '';
                            return `涨跌幅: ${sign}${stock.dailyChange.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 创建趋势图表（可选）
function createTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    // 模拟历史数据
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const trends = [1.2, -0.5, 2.1, 1.8, -0.3, 0, 0]; // 周末无数据
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: '市场趋势',
                data: trends,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const sign = value >= 0 ? '+' : '';
                            return `${sign}${value.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// 更新图表数据
function updateCharts(newData) {
    // 这里可以添加更新图表的逻辑
    console.log('更新图表数据:', newData);
}

// 导出函数
window.stockCharts = {
    initCharts,
    createChangeChart,
    createPriceChart,
    createTrendChart,
    updateCharts
};