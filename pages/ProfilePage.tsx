import React, { useState } from 'react';

interface ProfilePageProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
    onNavigate: (view: string) => void;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    linkedIn: string;
    joinedDate: string;
}

interface Activity {
    id: string;
    type: 'quote' | 'client' | 'shipment' | 'document';
    action: string;
    target: string;
    timestamp: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onShowToast, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'stats' | 'achievements'>('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [profile, setProfile] = useState<UserProfile>({
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@exportflow.com',
        phone: '+91 98765 43210',
        company: 'ExportFlow Demo',
        role: 'Export Manager',
        avatar: '👤',
        bio: 'Experienced export manager specializing in textile and handicraft exports to Europe and Middle East markets.',
        location: 'Mumbai, India',
        website: 'exportflow.com',
        linkedIn: 'linkedin.com/in/alexj',
        joinedDate: 'January 2024',
    });

    const [recentActivity] = useState<Activity[]>([
        { id: '1', type: 'quote', action: 'Created', target: 'Quote #Q-2024-089', timestamp: '2 hours ago' },
        { id: '2', type: 'client', action: 'Updated', target: 'TechCorp International', timestamp: '5 hours ago' },
        { id: '3', type: 'shipment', action: 'Tracked', target: 'Shipment SHIP-001', timestamp: 'Yesterday' },
        { id: '4', type: 'document', action: 'Generated', target: 'Commercial Invoice', timestamp: '2 days ago' },
        { id: '5', type: 'quote', action: 'Sent', target: 'Quote #Q-2024-088', timestamp: '3 days ago' },
        { id: '6', type: 'client', action: 'Added', target: 'Global Traders LLC', timestamp: '1 week ago' },
    ]);

    const stats = {
        totalQuotes: 156,
        activeQuotes: 23,
        closedDeals: 89,
        conversionRate: 57,
        totalRevenue: 2450000,
        avgDealSize: 27528,
        clientsManaged: 34,
        shipmentsCompleted: 67,
    };

    const achievements = [
        { id: '1', title: 'First Quote', desc: 'Created your first export quote', icon: '📋', earned: true, date: 'Jan 2024' },
        { id: '2', title: 'Deal Closer', desc: 'Closed 10 successful deals', icon: '🤝', earned: true, date: 'Mar 2024' },
        { id: '3', title: 'Million Dollar Club', desc: 'Reached $1M in total revenue', icon: '💎', earned: true, date: 'Jun 2024' },
        { id: '4', title: 'Client Magnet', desc: 'Onboarded 25 clients', icon: '🧲', earned: true, date: 'Aug 2024' },
        { id: '5', title: 'Export Expert', desc: 'Completed 50 shipments', icon: '🚢', earned: true, date: 'Oct 2024' },
        { id: '6', title: 'Top Performer', desc: 'Achieved 75% conversion rate', icon: '🏆', earned: false, date: null },
        { id: '7', title: 'Global Reach', desc: 'Exported to 20 countries', icon: '🌍', earned: false, date: null },
        { id: '8', title: 'Volume Master', desc: 'Processed 200 quotes', icon: '📊', earned: false, date: null },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setIsEditing(false);
        onShowToast('success', 'Profile Updated', 'Your changes have been saved.');
    };

    const getActivityIcon = (type: Activity['type']) => {
        const icons = { quote: 'description', client: 'person', shipment: 'local_shipping', document: 'article' };
        return icons[type];
    };

    const getActivityColor = (type: Activity['type']) => {
        const colors = {
            quote: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            client: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            shipment: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            document: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
        };
        return colors[type];
    };

    return (
        <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 px-8 pt-8 pb-24">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-5xl shadow-lg">
                            {profile.avatar}
                        </div>
                        <div className="text-white">
                            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
                            <p className="opacity-80">{profile.role} at {profile.company}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm opacity-70">
                                <span className="flex items-center gap-1">
                                    <span className="material-icons-outlined text-sm">location_on</span>
                                    {profile.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-icons-outlined text-sm">calendar_today</span>
                                    Member since {profile.joinedDate}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                    >
                        {isSaving ? (
                            <>
                                <span className="material-icons-outlined animate-spin text-sm">refresh</span>
                                Saving...
                            </>
                        ) : isEditing ? (
                            <>
                                <span className="material-icons-outlined text-sm">save</span>
                                Save Changes
                            </>
                        ) : (
                            <>
                                <span className="material-icons-outlined text-sm">edit</span>
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="flex-1 overflow-hidden -mt-16 px-8">
                {/* Tab Navigation */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg mb-6">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        {[
                            { id: 'overview', label: 'Overview', icon: 'person' },
                            { id: 'activity', label: 'Activity', icon: 'history' },
                            { id: 'stats', label: 'Statistics', icon: 'insights' },
                            { id: 'achievements', label: 'Achievements', icon: 'emoji_events' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                <span className="material-icons-outlined text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto pb-8" style={{ height: 'calc(100% - 72px)' }}>
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-3 gap-6">
                            {/* Profile Details */}
                            <div className="col-span-2 space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">About</h3>
                                    {isEditing ? (
                                        <textarea
                                            value={profile.bio}
                                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                                            className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none resize-none h-24"
                                        />
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
                                    )}
                                </div>

                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Email', value: profile.email, key: 'email', icon: 'email' },
                                            { label: 'Phone', value: profile.phone, key: 'phone', icon: 'phone' },
                                            { label: 'Website', value: profile.website, key: 'website', icon: 'language' },
                                            { label: 'LinkedIn', value: profile.linkedIn, key: 'linkedIn', icon: 'link' },
                                        ].map(field => (
                                            <div key={field.key} className="flex items-center gap-3">
                                                <span className="material-icons-outlined text-gray-400">{field.icon}</span>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">{field.label}</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={field.value}
                                                            onChange={(e) => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                            className="w-full px-2 py-1 bg-surface-light dark:bg-gray-800 rounded border-none text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-800 dark:text-gray-200">{field.value}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Quick Stats</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { label: 'Quotes', value: stats.totalQuotes, color: 'text-blue-600' },
                                            { label: 'Clients', value: stats.clientsManaged, color: 'text-purple-600' },
                                            { label: 'Shipments', value: stats.shipmentsCompleted, color: 'text-green-600' },
                                            { label: 'Conv. Rate', value: `${stats.conversionRate}%`, color: 'text-orange-600' },
                                        ].map(stat => (
                                            <div key={stat.label} className="text-center">
                                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                                <p className="text-xs text-gray-500">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                                    <div className="space-y-3">
                                        {recentActivity.slice(0, 4).map(activity => (
                                            <div key={activity.id} className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                                    <span className="material-icons-outlined text-sm">{getActivityIcon(activity.type)}</span>
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                                                        {activity.action} {activity.target}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('activity')}
                                        className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        View All Activity
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="material-icons-outlined">emoji_events</span>
                                        <span className="font-bold">5 of 8</span>
                                    </div>
                                    <p className="text-sm opacity-80 mb-3">
                                        Achievements unlocked. Keep going!
                                    </p>
                                    <div className="w-full h-2 bg-white/30 rounded-full">
                                        <div className="w-[62.5%] h-full bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-800 dark:text-white">Activity Log</h3>
                                <select className="px-3 py-1.5 bg-surface-light dark:bg-gray-800 rounded-lg text-sm border-none">
                                    <option value="all">All Activity</option>
                                    <option value="quotes">Quotes</option>
                                    <option value="clients">Clients</option>
                                    <option value="shipments">Shipments</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                            <span className="material-icons-outlined">{getActivityIcon(activity.type)}</span>
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-gray-800 dark:text-gray-200">
                                                <span className="font-medium">{activity.action}</span> {activity.target}
                                            </p>
                                            <p className="text-sm text-gray-500">{activity.timestamp}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                            <span className="material-icons-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-6">Performance Overview</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { label: 'Total Quotes', value: stats.totalQuotes, icon: 'description', color: 'blue' },
                                        { label: 'Active Quotes', value: stats.activeQuotes, icon: 'pending_actions', color: 'amber' },
                                        { label: 'Closed Deals', value: stats.closedDeals, icon: 'handshake', color: 'green' },
                                        { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: 'trending_up', color: 'purple' },
                                    ].map(stat => (
                                        <div key={stat.label} className="flex items-center gap-3">
                                            <span className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center`}>
                                                <span className="material-icons-outlined">{stat.icon}</span>
                                            </span>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                                                <p className="text-xs text-gray-500">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-6">Revenue Metrics</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-500">Total Revenue</span>
                                            <span className="text-lg font-bold text-green-600">${(stats.totalRevenue / 1000000).toFixed(2)}M</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: '75%' }} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">75% of annual target</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <p className="text-xl font-bold text-gray-800 dark:text-white">${stats.avgDealSize.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">Avg. Deal Size</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.clientsManaged}</p>
                                            <p className="text-xs text-gray-500">Clients Managed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-6">Monthly Performance</h3>
                                <div className="flex items-end justify-between gap-2 h-48">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                                        const height = 30 + Math.random() * 70;
                                        const current = i === 10;
                                        return (
                                            <div key={month} className="flex-1 flex flex-col items-center gap-2">
                                                <div
                                                    className={`w-full rounded-t-lg transition-all ${
                                                        current ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                                    style={{ height: `${height}%` }}
                                                />
                                                <span className={`text-xs ${current ? 'text-primary font-medium' : 'text-gray-500'}`}>
                                                    {month}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'achievements' && (
                        <div className="grid grid-cols-4 gap-4">
                            {achievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className={`bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm text-center transition-all ${
                                        achievement.earned
                                            ? 'ring-2 ring-amber-400'
                                            : 'opacity-60 grayscale'
                                    }`}
                                >
                                    <span className="text-4xl block mb-3">{achievement.icon}</span>
                                    <h4 className="font-bold text-gray-800 dark:text-white mb-1">{achievement.title}</h4>
                                    <p className="text-xs text-gray-500 mb-3">{achievement.desc}</p>
                                    {achievement.earned ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs">
                                            <span className="material-icons-outlined text-xs">verified</span>
                                            Earned {achievement.date}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 dark:bg-gray-800 rounded-full text-xs">
                                            <span className="material-icons-outlined text-xs">lock</span>
                                            Locked
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
