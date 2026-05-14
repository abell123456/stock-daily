// 股票数据配置文件
const STOCK_DATA = {
    lastUpdate: new Date().toISOString(),
    marketSummary: "今日美股市场整体表现平稳，科技股领涨，能源板块小幅回调。市场情绪偏向乐观，投资者关注即将发布的经济数据。",
    keyInsights: [
        "科技股表现强劲，AI相关公司涨幅明显",
        "能源板块受油价波动影响小幅下跌",
        "市场成交量较昨日增加15%",
        "VIX恐慌指数维持在低位，市场情绪稳定"
    ],
    stocks: [
        {
            symbol: "AAPL",
            name: "苹果公司",
            currentPrice: 185.42,
            dailyChange: 1.25,
            volume: 45678900,
            high: 186.50,
            low: 183.20,
            trend: "up"
        },
        {
            symbol: "GOOGL",
            name: "谷歌",
            currentPrice: 152.38,
            dailyChange: 2.15,
            volume: 23456700,
            high: 153.20,
            low: 150.80,
            trend: "up"
        },
        {
            symbol: "TSLA",
            name: "特斯拉",
            currentPrice: 245.67,
            dailyChange: -0.85,
            volume: 78901200,
            high: 248.90,
            low: 242.30,
            trend: "down"
        },
        {
            symbol: "NVDA",
            name: "英伟达",
            currentPrice: 890.45,
            dailyChange: 3.45,
            volume: 56789000,
            high: 895.20,
            low: 885.30,
            trend: "up"
        },
        {
            symbol: "MSFT",
            name: "微软",
            currentPrice: 415.23,
            dailyChange: 0.95,
            volume: 34567800,
            high: 417.50,
            low: 412.80,
            trend: "up"
        },
        {
            symbol: "AMZN",
            name: "亚马逊",
            currentPrice: 178.56,
            dailyChange: 1.65,
            volume: 45678900,
            high: 180.20,
            low: 176.80,
            trend: "up"
        }
    ],
    recommendations: [
        "重点关注AI相关科技股，如NVDA、GOOGL",
        "能源板块建议观望，等待油价稳定",
        "防御性股票可作为投资组合的稳定器",
        "建议配置20%现金，等待更好的入场机会"
    ],
    riskWarnings: [
        "市场波动可能加大，注意控制仓位",
        "关注美联储政策变化对市场的影响",
        "财报季临近，注意个股业绩风险",
        "地缘政治风险可能影响市场情绪"
    ],
    tomorrowOutlook: [
        "预计市场将继续震荡上行",
        "关注科技股财报发布",
        "经济数据可能引发短期波动",
        "建议保持谨慎乐观态度"
    ]
};

// 格式化数字
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// 格式化百分比
function formatPercent(num) {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
}

// 获取涨跌颜色类名
function getChangeClass(change) {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
}

// 获取趋势图标
function getTrendIcon(trend) {
    if (trend === 'up') return 'fas fa-arrow-up';
    if (trend === 'down') return 'fas fa-arrow-down';
    return 'fas fa-minus';
}

// 计算统计数据
function calculateStats() {
    const stocks = STOCK_DATA.stocks;
    const totalChange = stocks.reduce((sum, stock) => sum + stock.dailyChange, 0) / stocks.length;
    const positiveStocks = stocks.filter(stock => stock.dailyChange > 0).length;
    const recommendationScore = Math.round((positiveStocks / stocks.length) * 100);
    
    return {
        totalChange: totalChange.toFixed(2),
        stockCount: stocks.length,
        recommendationScore: recommendationScore,
        positiveStocks: positiveStocks,
        negativeStocks: stocks.length - positiveStocks
    };
}

// 导出数据
window.stockData = STOCK_DATA;
window.stockUtils = {
    formatNumber,
    formatPercent,
    getChangeClass,
    getTrendIcon,
    calculateStats
};