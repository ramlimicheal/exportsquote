import React, { useState } from 'react';

interface AIInsight {
    id: string;
    category: 'opportunity' | 'warning' | 'trend' | 'anomaly' | 'recommendation';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    actionRequired: boolean;
    actionLabel?: string;
    onAction?: () => void;
}

interface AIInsightsPanelProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
    className?: string;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ onShowToast, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    // Mock AI-generated insights
    const insights: AIInsight[] = [
        {
            id: 'ins-1',
            category: 'opportunity',
            title: 'High-value quote pending',
            description: 'Quote QT-2024-004 for BuildRight Construction ($850K) has been pending for 3 days. Consider a follow-up call.',
            impact: 'high',
            actionRequired: true,
            actionLabel: 'View Quote'
        },
        {
            id: 'ins-2',
            category: 'warning',
            title: 'Low margin alert',
            description: 'Current quote margin (12.5%) is below your 15% threshold. Consider adjusting pricing or reducing costs.',
            impact: 'high',
            actionRequired: true,
            actionLabel: 'Optimize'
        },
        {
            id: 'ins-3',
            category: 'trend',
            title: 'Spice exports trending up',
            description: 'Cardamom and Black Pepper exports increased 23% this quarter. Consider increasing inventory.',
            impact: 'medium',
            actionRequired: false
        },
        {
            id: 'ins-4',
            category: 'recommendation',
            title: 'Suggest CIF for UAE clients',
            description: 'UAE clients show 85% higher conversion with CIF terms. Global Retail Partners prefers CIF.',
            impact: 'medium',
            actionRequired: false,
            actionLabel: 'Apply'
        },
        {
            id: 'ins-5',
            category: 'anomaly',
            title: 'Unusual shipping delay',
            description: 'Shipment SH-002 to Dubai is 2 days behind schedule. Customs clearance pending.',
            impact: 'high',
            actionRequired: true,
            actionLabel: 'Track'
        },
        {
            id: 'ins-6',
            category: 'opportunity',
            title: 'Container optimization',
            description: 'Adding 50 more units of PK-CB-100 would fill container to 95% utilization, saving $180 in freight.',
            impact: 'medium',
            actionRequired: false,
            actionLabel: 'Add Items'
        }
    ];

    const visibleInsights = insights.filter(i => !dismissedIds.includes(i.id));

    const handleDismiss = (id: string) => {
        setDismissedIds(prev => [...prev, id]);
        onShowToast('info', 'Insight Dismissed', 'You can restore dismissed insights in settings');
    };

    const handleAction = (insight: AIInsight) => {
        onShowToast('success', 'Action Taken', insight.title);
    };

    const getCategoryStyles = (category: AIInsight['category']) => {
        switch (category) {
            case 'opportunity':
                return { icon: 'lightbulb', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
            case 'warning':
                return { icon: 'warning', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
            case 'trend':
                return { icon: 'trending_up', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' };
            case 'anomaly':
                return { icon: 'error_outline', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
            case 'recommendation':
                return { icon: 'auto_awesome', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' };
            default:
                return { icon: 'info', bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' };
        }
    };

    const getImpactBadge = (impact: AIInsight['impact']) => {
        switch (impact) {
            case 'high':
                return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full">High Impact</span>;
            case 'medium':
                return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">Medium</span>;
            case 'low':
                return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full">Low</span>;
        }
    };

    if (visibleInsights.length === 0) {
        return null;
    }

    return (
        <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 overflow-hidden ${className}`}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="material-icons-outlined text-white text-sm">auto_awesome</span>
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white">AI Insights</h3>
                        <p className="text-[10px] text-gray-500">{visibleInsights.length} active recommendations</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {visibleInsights.filter(i => i.actionRequired).length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                    <span className={`material-icons-outlined text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>
            </button>

            {/* Insights List */}
            {isExpanded && (
                <div className="px-3 pb-3 space-y-2 max-h-[300px] overflow-y-auto">
                    {visibleInsights.slice(0, 4).map(insight => {
                        const styles = getCategoryStyles(insight.category);
                        return (
                            <div
                                key={insight.id}
                                className={`${styles.bg} ${styles.border} border rounded-xl p-3 relative group`}
                            >
                                <button
                                    onClick={() => handleDismiss(insight.id)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/50 dark:hover:bg-black/30 rounded-full transition-all"
                                    title="Dismiss"
                                >
                                    <span className="material-icons-outlined text-gray-400 text-sm">close</span>
                                </button>

                                <div className="flex items-start gap-2">
                                    <span className={`material-icons-outlined ${styles.text} text-lg`}>
                                        {styles.icon}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={`text-sm font-semibold ${styles.text}`}>{insight.title}</h4>
                                            {getImpactBadge(insight.impact)}
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            {insight.description}
                                        </p>
                                        {insight.actionLabel && (
                                            <button
                                                onClick={() => handleAction(insight)}
                                                className={`text-xs font-medium ${styles.text} hover:underline flex items-center gap-1`}
                                            >
                                                {insight.actionLabel}
                                                <span className="material-icons-outlined text-xs">arrow_forward</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {visibleInsights.length > 4 && (
                        <button
                            onClick={() => onShowToast('info', 'View All Insights', 'Opening insights dashboard...')}
                            className="w-full py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors"
                        >
                            View {visibleInsights.length - 4} more insights
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIInsightsPanel;
