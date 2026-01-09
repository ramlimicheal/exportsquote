import React, { useState } from 'react';
import { ANALYTICS, PRODUCTS } from '../constants';

interface ReportsPageProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onShowToast }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'clients' | 'forecasts'>('overview');
    const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('6m');
    const [showGoalEditor, setShowGoalEditor] = useState(false);
    
    // Goals and targets
    const goals = {
        monthlyRevenue: 300000,
        conversionRate: 80,
        avgDealSize: 50000,
        newClients: 5
    };
    
    // Current progress
    const currentProgress = {
        monthlyRevenue: ANALYTICS.totalRevenue / 6, // Avg monthly
        conversionRate: ANALYTICS.conversionRate,
        avgDealSize: ANALYTICS.avgQuoteValue,
        newClients: 3
    };
    
    // AI-generated forecast
    const forecast = {
        nextMonthRevenue: Math.round(ANALYTICS.totalRevenue / 6 * 1.08),
        quarterlyGrowth: 12.5,
        riskFactors: [
            { factor: 'Seasonal demand fluctuation', impact: 'medium', suggestion: 'Consider promotional pricing in Q2' },
            { factor: 'Client concentration', impact: 'high', suggestion: 'Diversify client base to reduce dependency' },
        ],
        opportunities: [
            { opportunity: 'Textile exports to EU', potential: '$125,000', confidence: 78 },
            { opportunity: 'New chemical product line', potential: '$85,000', confidence: 65 },
        ]
    };

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value}`;
    };

    const maxRevenue = Math.max(...ANALYTICS.monthlyData.map(m => m.revenue));

    const handleExport = (format: 'csv' | 'pdf') => {
        onShowToast('success', 'Export Started', `Generating ${format.toUpperCase()} report...`);
    };

    return (
        <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h1>
                    <p className="text-sm text-gray-500">Track performance and gain insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg p-1">
                        {(['6m', '1y', 'all'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${timeRange === range
                                        ? 'bg-white dark:bg-card-dark shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {range === '6m' ? '6 Months' : range === '1y' ? '1 Year' : 'All Time'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <span className="material-icons-outlined text-sm">download</span>
                        Export CSV
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        <span className="material-icons-outlined text-sm">picture_as_pdf</span>
                        Export PDF
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="px-8 pt-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex gap-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: 'dashboard' },
                        { id: 'products', label: 'Products', icon: 'inventory_2' },
                        { id: 'clients', label: 'Clients', icon: 'groups' },
                        { id: 'forecasts', label: 'AI Forecasts', icon: 'auto_awesome', badge: 'NEW' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="material-icons-outlined text-sm">{tab.icon}</span>
                            {tab.label}
                            {(tab as any).badge && (
                                <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded-full">
                                    {(tab as any).badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Goal Progress Section */}
                        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-900/20 rounded-2xl p-5 border border-primary/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-primary">flag</span>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Monthly Goals Progress</h3>
                                </div>
                                <button 
                                    onClick={() => { setShowGoalEditor(!showGoalEditor); onShowToast('info', 'Goal Editor', 'Coming soon!'); }}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <span className="material-icons-outlined text-xs">edit</span>
                                    Edit Goals
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Revenue', current: currentProgress.monthlyRevenue, goal: goals.monthlyRevenue, format: formatCurrency },
                                    { label: 'Conversion', current: currentProgress.conversionRate, goal: goals.conversionRate, format: (v: number) => `${v}%` },
                                    { label: 'Avg Deal', current: currentProgress.avgDealSize, goal: goals.avgDealSize, format: formatCurrency },
                                    { label: 'New Clients', current: currentProgress.newClients, goal: goals.newClients, format: (v: number) => v.toString() },
                                ].map((item, i) => {
                                    const progress = Math.min((item.current / item.goal) * 100, 100);
                                    const isOnTrack = progress >= 70;
                                    return (
                                        <div key={i} className="bg-white dark:bg-surface-dark rounded-xl p-3">
                                            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                            <p className="text-lg font-bold text-gray-800 dark:text-white">{item.format(item.current)}</p>
                                            <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all ${isOnTrack ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {progress.toFixed(0)}% of {item.format(item.goal)} goal
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span className="material-icons-outlined text-primary">payments</span>
                                    </div>
                                    <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                        <span className="material-icons-outlined text-xs">trending_up</span>
                                        +12.5%
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(ANALYTICS.totalRevenue)}</p>
                                <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                                        <span className="material-icons-outlined text-secondary">description</span>
                                    </div>
                                    <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                        <span className="material-icons-outlined text-xs">trending_up</span>
                                        +8
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{ANALYTICS.totalQuotes}</p>
                                <p className="text-xs text-gray-500 mt-1">Total Quotes</p>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <span className="material-icons-outlined text-green-600">check_circle</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{ANALYTICS.conversionRate}%</p>
                                <p className="text-xs text-gray-500 mt-1">Conversion Rate</p>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <span className="material-icons-outlined text-blue-600">analytics</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(ANALYTICS.avgQuoteValue)}</p>
                                <p className="text-xs text-gray-500 mt-1">Avg Quote Value</p>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Revenue Chart */}
                            <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <h3 className="font-bold mb-4">Revenue Trend</h3>
                                <div className="flex items-end gap-2 h-48">
                                    {ANALYTICS.monthlyData.map((month, index) => (
                                        <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full flex flex-col items-center">
                                                <span className="text-xs font-semibold text-primary mb-1">
                                                    {formatCurrency(month.revenue)}
                                                </span>
                                                <div
                                                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all hover:from-primary/80"
                                                    style={{ height: `${(month.revenue / maxRevenue) * 150}px` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500">{month.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Conversion Funnel */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <h3 className="font-bold mb-4">Quote Funnel</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Total Quotes</span>
                                            <span className="font-semibold">{ANALYTICS.totalQuotes}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                                            <div className="bg-primary h-3 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Sent</span>
                                            <span className="font-semibold">21</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                                            <div className="bg-blue-500 h-3 rounded-full" style={{ width: '87.5%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Approved</span>
                                            <span className="font-semibold">{ANALYTICS.approvedQuotes}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                                            <div className="bg-green-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                                    <p className="text-3xl font-bold text-green-500">{ANALYTICS.conversionRate}%</p>
                                    <p className="text-xs text-gray-500">Conversion Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold">Product Performance</h3>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Units Sold</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">% of Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {ANALYTICS.topProducts.map((item, index) => {
                                        const percentage = (item.revenue / ANALYTICS.totalRevenue) * 100;
                                        return (
                                            <tr key={item.product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                                index === 1 ? 'bg-gray-100 text-gray-500' :
                                                                    index === 2 ? 'bg-orange-100 text-orange-600' :
                                                                        'bg-primary/10 text-primary'
                                                            }`}>
                                                            {index < 3 ? (
                                                                <span className="font-bold text-sm">{index + 1}</span>
                                                            ) : (
                                                                <span className="material-icons-outlined text-sm">{item.product.icon}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{item.product.name}</p>
                                                            <p className="text-xs text-gray-500">{item.product.sku}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right font-semibold">{item.unitsSold.toLocaleString()}</td>
                                                <td className="px-4 py-4 text-right font-semibold text-green-600">{formatCurrency(item.revenue)}</td>
                                                <td className="px-4 py-4 text-right">{percentage.toFixed(1)}%</td>
                                                <td className="px-4 py-4">
                                                    <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                                        <div
                                                            className="bg-primary h-2 rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Product Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                        <span className="material-icons-outlined text-yellow-600">emoji_events</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Top Performer</p>
                                        <p className="font-bold">{ANALYTICS.topProducts[0].product.name}</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(ANALYTICS.topProducts[0].revenue)}</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <span className="material-icons-outlined text-green-600">trending_up</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Highest Margin</p>
                                        <p className="font-bold">Spices - Cardamom</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-green-600">27.3%</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <span className="material-icons-outlined text-blue-600">speed</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Fastest Moving</p>
                                        <p className="font-bold">Packaging Boxes</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">2,400 units</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'forecasts' && (
                    <div className="space-y-6">
                        {/* AI Forecast Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-icons-outlined text-3xl">auto_awesome</span>
                                <div>
                                    <h2 className="text-xl font-bold">AI-Powered Forecasts</h2>
                                    <p className="text-sm opacity-80">Predictive analytics based on your historical data</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-sm opacity-80 mb-1">Next Month Revenue</p>
                                    <p className="text-2xl font-bold">{formatCurrency(forecast.nextMonthRevenue)}</p>
                                    <p className="text-xs text-green-300 flex items-center gap-1 mt-1">
                                        <span className="material-icons-outlined text-xs">trending_up</span>
                                        +8% projected growth
                                    </p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-sm opacity-80 mb-1">Quarterly Growth</p>
                                    <p className="text-2xl font-bold">{forecast.quarterlyGrowth}%</p>
                                    <p className="text-xs opacity-70 mt-1">Based on current trajectory</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-sm opacity-80 mb-1">Confidence Score</p>
                                    <p className="text-2xl font-bold">82%</p>
                                    <p className="text-xs opacity-70 mt-1">High prediction accuracy</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Risk Factors */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-icons-outlined text-orange-500">warning</span>
                                    <h3 className="font-bold">Risk Factors</h3>
                                </div>
                                <div className="space-y-3">
                                    {forecast.riskFactors.map((risk, i) => (
                                        <div key={i} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30">
                                            <div className="flex items-start justify-between mb-2">
                                                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{risk.factor}</p>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    risk.impact === 'high' ? 'bg-red-100 text-red-600' :
                                                    risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-green-100 text-green-600'
                                                }`}>
                                                    {risk.impact} impact
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 flex items-start gap-1">
                                                <span className="material-icons-outlined text-xs text-primary mt-0.5">lightbulb</span>
                                                {risk.suggestion}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Opportunities */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-icons-outlined text-green-500">rocket_launch</span>
                                    <h3 className="font-bold">Growth Opportunities</h3>
                                </div>
                                <div className="space-y-3">
                                    {forecast.opportunities.map((opp, i) => (
                                        <div key={i} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{opp.opportunity}</p>
                                                <span className="text-green-600 font-bold">{opp.potential}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                    <div 
                                                        className="h-full bg-green-500 rounded-full" 
                                                        style={{ width: `${opp.confidence}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">{opp.confidence}% confidence</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => onShowToast('info', 'Opportunity Analysis', 'Generating detailed analysis...')}
                                    className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                >
                                    View Full Analysis
                                </button>
                            </div>
                        </div>
                        
                        {/* Trend Predictions */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-blue-500">show_chart</span>
                                    <h3 className="font-bold">12-Month Revenue Projection</h3>
                                </div>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <span className="material-icons-outlined text-xs">info</span>
                                    Based on historical trends and market analysis
                                </span>
                            </div>
                            <div className="flex items-end gap-2 h-48">
                                {[...ANALYTICS.monthlyData, 
                                    { month: 'Jan', revenue: forecast.nextMonthRevenue },
                                    { month: 'Feb', revenue: Math.round(forecast.nextMonthRevenue * 1.05) },
                                    { month: 'Mar', revenue: Math.round(forecast.nextMonthRevenue * 1.12) },
                                ].map((month, index, arr) => {
                                    const isForecast = index >= ANALYTICS.monthlyData.length;
                                    const maxRev = Math.max(...arr.map(m => m.revenue));
                                    return (
                                        <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full flex flex-col items-center">
                                                <span className={`text-xs font-semibold mb-1 ${isForecast ? 'text-purple-500' : 'text-primary'}`}>
                                                    {formatCurrency(month.revenue)}
                                                </span>
                                                <div
                                                    className={`w-full rounded-t-lg transition-all ${isForecast 
                                                        ? 'bg-gradient-to-t from-purple-500 to-purple-300 opacity-70 border-2 border-dashed border-purple-400' 
                                                        : 'bg-gradient-to-t from-primary to-primary/60'}`}
                                                    style={{ height: `${(month.revenue / maxRev) * 150}px` }}
                                                />
                                            </div>
                                            <span className={`text-xs ${isForecast ? 'text-purple-500 font-medium' : 'text-gray-500'}`}>
                                                {month.month}
                                                {isForecast && <span className="block text-[8px]">(forecast)</span>}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'clients' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold">Client Performance</h3>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total Quotes</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Conversion</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {ANALYTICS.topClients.map((item, index) => (
                                        <tr key={item.client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.client.avatar}
                                                        alt={item.client.companyName}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.client.companyName}</p>
                                                        <p className="text-xs text-gray-500">{item.client.contactName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right font-semibold">{item.totalQuotes}</td>
                                            <td className="px-4 py-4 text-right font-semibold text-green-600">{formatCurrency(item.revenue)}</td>
                                            <td className="px-4 py-4 text-right">
                                                <span className={`font-semibold ${item.conversionRate >= 80 ? 'text-green-600' :
                                                        item.conversionRate >= 60 ? 'text-primary' :
                                                            'text-yellow-600'
                                                    }`}>
                                                    {item.conversionRate}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.client.status === 'active'
                                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {item.client.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Client Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <h3 className="font-bold mb-4">Revenue by Client</h3>
                                <div className="space-y-3">
                                    {ANALYTICS.topClients.map(item => {
                                        const percentage = (item.revenue / ANALYTICS.totalRevenue) * 100;
                                        return (
                                            <div key={item.client.id}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium">{item.client.companyName}</span>
                                                    <span className="text-gray-500">{formatCurrency(item.revenue)} ({percentage.toFixed(0)}%)</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                                <h3 className="font-bold mb-4">Client Health Score</h3>
                                <div className="space-y-4">
                                    {ANALYTICS.topClients.map(item => {
                                        const healthScore = Math.round((item.conversionRate * 0.5) + (item.totalQuotes * 3));
                                        return (
                                            <div key={item.client.id} className="flex items-center gap-4">
                                                <img
                                                    src={item.client.avatar}
                                                    alt={item.client.companyName}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.client.companyName}</p>
                                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-1">
                                                        <div
                                                            className={`h-1.5 rounded-full ${healthScore >= 60 ? 'bg-green-500' :
                                                                    healthScore >= 40 ? 'bg-yellow-500' :
                                                                        'bg-red-500'
                                                                }`}
                                                            style={{ width: `${healthScore}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className={`font-bold ${healthScore >= 60 ? 'text-green-600' :
                                                        healthScore >= 40 ? 'text-yellow-600' :
                                                            'text-red-500'
                                                    }`}>
                                                    {healthScore}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ReportsPage;
