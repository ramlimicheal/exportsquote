import React, { useState } from 'react';
import { ANALYTICS, RECENT_QUOTES, SHIPMENTS, CLIENTS, PRODUCTS } from '../constants';
import { ViewType } from '../types';

interface DashboardPageProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
    onNavigate: (view: ViewType) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onShowToast, onNavigate }) => {
    const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter'>('month');

    // Calculate live stats
    const activeShipments = SHIPMENTS.filter(s => s.status !== 'delivered').length;
    const pendingQuotes = RECENT_QUOTES.filter(q => q.status === 'Sent' || q.status === 'Draft').length;
    const activeClients = Object.values(CLIENTS).filter(c => c.status === 'active' && c.id !== 'me').length;

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value}`;
    };

    // Quick action cards
    const quickActions = [
        { icon: 'add_circle', label: 'New Quote', color: 'bg-primary', action: () => { onNavigate('quotes'); onShowToast('success', 'Creating Quote', 'Opening quote builder...'); } },
        { icon: 'person_add', label: 'Add Client', color: 'bg-green-500', action: () => { onNavigate('clients'); onShowToast('info', 'Add Client', 'Opening client form...'); } },
        { icon: 'inventory_2', label: 'Add Product', color: 'bg-blue-500', action: () => { onNavigate('products'); onShowToast('info', 'Add Product', 'Opening product form...'); } },
        { icon: 'local_shipping', label: 'Track Shipment', color: 'bg-orange-500', action: () => { onNavigate('logistics'); onShowToast('info', 'Track Shipment', 'Opening logistics view...'); } },
    ];

    // KPI Cards data
    const kpis = [
        {
            title: 'Total Revenue',
            value: formatCurrency(ANALYTICS.totalRevenue),
            change: '+12.5%',
            trend: 'up',
            icon: 'payments',
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            title: 'Active Quotes',
            value: ANALYTICS.totalQuotes.toString(),
            subtitle: `${pendingQuotes} pending`,
            change: '+8',
            trend: 'up',
            icon: 'description',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Conversion Rate',
            value: `${ANALYTICS.conversionRate}%`,
            change: '+2.3%',
            trend: 'up',
            icon: 'trending_up',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            title: 'Avg Quote Value',
            value: formatCurrency(ANALYTICS.avgQuoteValue),
            change: '+5.2%',
            trend: 'up',
            icon: 'attach_money',
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        },
    ];

    // Pipeline data
    const pipeline = [
        { stage: 'Draft', count: 4, value: 125000, color: 'bg-gray-400' },
        { stage: 'Sent', count: 8, value: 420000, color: 'bg-blue-500' },
        { stage: 'Negotiating', count: 3, value: 185000, color: 'bg-yellow-500' },
        { stage: 'Approved', count: 6, value: 555450, color: 'bg-green-500' },
    ];
    const totalPipelineValue = pipeline.reduce((sum, p) => sum + p.value, 0);

    return (
        <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome back! Here's your export business overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Time Range Selector */}
                    <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg p-1">
                        {(['today', 'week', 'month', 'quarter'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-white dark:bg-card-dark shadow-sm text-primary'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                    {/* Refresh button */}
                    <button
                        onClick={() => onShowToast('info', 'Refreshing', 'Updating dashboard data...')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <span className="material-icons-outlined text-gray-500">refresh</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.action}
                            className="flex items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                                <span className="material-icons-outlined">{action.icon}</span>
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                                    <span className={`material-icons-outlined ${kpi.color}`}>{kpi.icon}</span>
                                </div>
                                <span className={`text-xs font-medium flex items-center gap-1 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                    <span className="material-icons-outlined text-xs">
                                        {kpi.trend === 'up' ? 'trending_up' : 'trending_down'}
                                    </span>
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{kpi.value}</p>
                            <p className="text-xs text-gray-500">{kpi.title}</p>
                            {kpi.subtitle && <p className="text-[10px] text-gray-400">{kpi.subtitle}</p>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Sales Pipeline */}
                    <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white">Sales Pipeline</h3>
                            <button
                                onClick={() => onNavigate('quotes')}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Total Pipeline Value</span>
                                <span className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(totalPipelineValue)}</span>
                            </div>
                            {/* Pipeline Bar */}
                            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                                {pipeline.map((stage, index) => (
                                    <div
                                        key={index}
                                        className={`${stage.color} h-full transition-all`}
                                        style={{ width: `${(stage.value / totalPipelineValue) * 100}%` }}
                                        title={`${stage.stage}: ${formatCurrency(stage.value)}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {pipeline.map((stage, index) => (
                                <div key={index} className="text-center">
                                    <div className={`w-3 h-3 ${stage.color} rounded-full mx-auto mb-1`} />
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{stage.stage}</p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-white">{stage.count}</p>
                                    <p className="text-[10px] text-gray-500">{formatCurrency(stage.value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {[
                                { icon: 'check_circle', color: 'text-green-500', text: 'Quote QT-2024-004 approved', time: '2h ago' },
                                { icon: 'local_shipping', color: 'text-blue-500', text: 'Shipment SH-001 departed Chennai', time: '4h ago' },
                                { icon: 'person_add', color: 'text-purple-500', text: 'New client: PharmaPure International', time: '6h ago' },
                                { icon: 'payments', color: 'text-orange-500', text: 'Payment received: $28,500', time: '1d ago' },
                                { icon: 'description', color: 'text-gray-500', text: 'Quote QT-2024-005 sent to Fashion Forward', time: '1d ago' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <span className={`material-icons-outlined ${activity.color} text-lg`}>{activity.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{activity.text}</p>
                                        <p className="text-[10px] text-gray-400">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => onShowToast('info', 'View All Activity', 'Opening activity log...')}
                            className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                            View All Activity
                        </button>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Products */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white">Top Products</h3>
                            <button
                                onClick={() => onNavigate('products')}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {ANALYTICS.topProducts.slice(0, 4).map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        <span className="material-icons-outlined text-sm">{item.product.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                                        <p className="text-[10px] text-gray-500">{item.unitsSold} units sold</p>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">{formatCurrency(item.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Clients */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white">Top Clients</h3>
                            <button
                                onClick={() => onNavigate('clients')}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {ANALYTICS.topClients.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <img
                                        src={item.client.avatar}
                                        alt={item.client.companyName}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.client.companyName}</p>
                                        <p className="text-[10px] text-gray-500">{item.totalQuotes} quotes • {item.conversionRate}% conv.</p>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">{formatCurrency(item.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipments Overview */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white">Active Shipments</h3>
                            <button
                                onClick={() => onNavigate('logistics')}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-blue-600">{activeShipments}</p>
                                <p className="text-xs text-gray-500">In Transit</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-green-600">{SHIPMENTS.filter(s => s.status === 'delivered').length}</p>
                                <p className="text-xs text-gray-500">Delivered</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {SHIPMENTS.filter(s => s.status !== 'delivered').slice(0, 3).map((shipment, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <span className={`material-icons-outlined text-sm ${shipment.status === 'in_transit' ? 'text-blue-500' :
                                            shipment.status === 'customs' ? 'text-orange-500' : 'text-gray-400'
                                        }`}>
                                        {shipment.status === 'in_transit' ? 'flight' : shipment.status === 'customs' ? 'gavel' : 'pending'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{shipment.quoteRef}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{shipment.destination}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-400">ETA: {shipment.eta.split('-').slice(1).join('/')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">K</kbd> to open Command Palette
                    </p>
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
