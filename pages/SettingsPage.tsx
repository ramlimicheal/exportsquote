import React, { useState } from 'react';

interface SettingsPageProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

interface UserSettings {
    // Profile
    companyName: string;
    email: string;
    phone: string;
    timezone: string;
    language: string;
    
    // Business
    defaultCurrency: string;
    defaultIncoterm: string;
    taxRate: number;
    quoteValidityDays: number;
    
    // Notifications
    emailNotifications: boolean;
    pushNotifications: boolean;
    quotesNotifications: boolean;
    shipmentsNotifications: boolean;
    paymentsNotifications: boolean;
    weeklyDigest: boolean;
    
    // Display
    compactMode: boolean;
    showAIInsights: boolean;
    autoSaveQuotes: boolean;
    
    // Integrations
    whatsappEnabled: boolean;
    slackEnabled: boolean;
    zapierEnabled: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onShowToast, isDarkMode, onToggleDarkMode }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'business' | 'notifications' | 'integrations' | 'security'>('general');
    const [isSaving, setIsSaving] = useState(false);
    
    const [settings, setSettings] = useState<UserSettings>({
        companyName: 'ExportFlow Demo',
        email: 'alex@exportflow.com',
        phone: '+91 98765 43210',
        timezone: 'Asia/Kolkata',
        language: 'en',
        defaultCurrency: 'USD',
        defaultIncoterm: 'FOB',
        taxRate: 18,
        quoteValidityDays: 30,
        emailNotifications: true,
        pushNotifications: true,
        quotesNotifications: true,
        shipmentsNotifications: true,
        paymentsNotifications: true,
        weeklyDigest: false,
        compactMode: false,
        showAIInsights: true,
        autoSaveQuotes: true,
        whatsappEnabled: true,
        slackEnabled: false,
        zapierEnabled: false,
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        onShowToast('success', 'Settings Saved', 'Your preferences have been updated.');
    };

    const handleReset = () => {
        onShowToast('info', 'Settings Reset', 'All settings restored to defaults.');
    };

    const tabs = [
        { id: 'general', label: 'General', icon: 'settings' },
        { id: 'business', label: 'Business', icon: 'business' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'integrations', label: 'Integrations', icon: 'extension' },
        { id: 'security', label: 'Security', icon: 'security' },
    ];

    const renderToggle = (
        value: boolean, 
        onChange: (val: boolean) => void, 
        label: string, 
        description?: string
    ) => (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                {description && <p className="text-xs text-gray-500">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!value)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                    value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        value ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );

    return (
        <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
                    <p className="text-sm text-gray-500">Manage your account and preferences</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        Reset to Default
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <span className="material-icons-outlined animate-spin text-sm">refresh</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="material-icons-outlined text-sm">save</span>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Tabs */}
                <div className="w-56 border-r border-gray-200 dark:border-gray-800 p-4">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className="material-icons-outlined text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-2xl">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Profile Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                                            <input
                                                type="text"
                                                value={settings.companyName}
                                                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                                                className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={settings.email}
                                                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={settings.phone}
                                                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Display Preferences</h3>
                                    <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
                                        {renderToggle(
                                            isDarkMode,
                                            onToggleDarkMode,
                                            'Dark Mode',
                                            'Use dark theme across the application'
                                        )}
                                        {renderToggle(
                                            settings.compactMode,
                                            (val) => setSettings(prev => ({ ...prev, compactMode: val })),
                                            'Compact Mode',
                                            'Reduce spacing for more content'
                                        )}
                                        {renderToggle(
                                            settings.showAIInsights,
                                            (val) => setSettings(prev => ({ ...prev, showAIInsights: val })),
                                            'AI Insights',
                                            'Show AI-powered suggestions and recommendations'
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Localization</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                                            <select
                                                value={settings.timezone}
                                                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                                                className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                            >
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                <option value="America/New_York">America/New_York (EST)</option>
                                                <option value="Europe/London">Europe/London (GMT)</option>
                                                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                                            <select
                                                value={settings.language}
                                                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                                                className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                            >
                                                <option value="en">English</option>
                                                <option value="hi">Hindi</option>
                                                <option value="ar">Arabic</option>
                                                <option value="zh">Chinese</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'business' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Quote Defaults</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Currency</label>
                                            <select
                                                value={settings.defaultCurrency}
                                                onChange={(e) => setSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
                                                className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                            >
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - British Pound</option>
                                                <option value="INR">INR - Indian Rupee</option>
                                                <option value="AED">AED - UAE Dirham</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Incoterm</label>
                                            <select
                                                value={settings.defaultIncoterm}
                                                onChange={(e) => setSettings(prev => ({ ...prev, defaultIncoterm: e.target.value }))}
                                                className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                            >
                                                <option value="EXW">EXW - Ex Works</option>
                                                <option value="FOB">FOB - Free on Board</option>
                                                <option value="CIF">CIF - Cost Insurance Freight</option>
                                                <option value="DDP">DDP - Delivered Duty Paid</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Tax Rate (%)</label>
                                            <input
                                                type="number"
                                                value={settings.taxRate}
                                                onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                                                className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quote Validity (days)</label>
                                            <input
                                                type="number"
                                                value={settings.quoteValidityDays}
                                                onChange={(e) => setSettings(prev => ({ ...prev, quoteValidityDays: parseInt(e.target.value) }))}
                                                className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Automation</h3>
                                    <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
                                        {renderToggle(
                                            settings.autoSaveQuotes,
                                            (val) => setSettings(prev => ({ ...prev, autoSaveQuotes: val })),
                                            'Auto-Save Quotes',
                                            'Automatically save quotes as drafts while editing'
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Notification Channels</h3>
                                    <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
                                        {renderToggle(
                                            settings.emailNotifications,
                                            (val) => setSettings(prev => ({ ...prev, emailNotifications: val })),
                                            'Email Notifications',
                                            'Receive notifications via email'
                                        )}
                                        {renderToggle(
                                            settings.pushNotifications,
                                            (val) => setSettings(prev => ({ ...prev, pushNotifications: val })),
                                            'Push Notifications',
                                            'Receive browser push notifications'
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Notification Types</h3>
                                    <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
                                        {renderToggle(
                                            settings.quotesNotifications,
                                            (val) => setSettings(prev => ({ ...prev, quotesNotifications: val })),
                                            'Quote Updates',
                                            'When quotes are approved, rejected, or expire'
                                        )}
                                        {renderToggle(
                                            settings.shipmentsNotifications,
                                            (val) => setSettings(prev => ({ ...prev, shipmentsNotifications: val })),
                                            'Shipment Updates',
                                            'Track shipment status changes'
                                        )}
                                        {renderToggle(
                                            settings.paymentsNotifications,
                                            (val) => setSettings(prev => ({ ...prev, paymentsNotifications: val })),
                                            'Payment Updates',
                                            'When payments are received or overdue'
                                        )}
                                        {renderToggle(
                                            settings.weeklyDigest,
                                            (val) => setSettings(prev => ({ ...prev, weeklyDigest: val })),
                                            'Weekly Digest',
                                            'Receive a weekly summary of your business'
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'integrations' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Connected Apps</h3>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'WhatsApp', icon: '💬', desc: 'Share quotes directly via WhatsApp', key: 'whatsappEnabled' as const, connected: settings.whatsappEnabled },
                                            { name: 'Slack', icon: '🔔', desc: 'Get notifications in Slack channels', key: 'slackEnabled' as const, connected: settings.slackEnabled },
                                            { name: 'Zapier', icon: '⚡', desc: 'Connect with 5000+ apps', key: 'zapierEnabled' as const, connected: settings.zapierEnabled },
                                        ].map(app => (
                                            <div key={app.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{app.icon}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-gray-200">{app.name}</p>
                                                        <p className="text-xs text-gray-500">{app.desc}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSettings(prev => ({ ...prev, [app.key]: !prev[app.key] }));
                                                        onShowToast(
                                                            app.connected ? 'info' : 'success',
                                                            app.connected ? 'Disconnected' : 'Connected',
                                                            `${app.name} has been ${app.connected ? 'disconnected' : 'connected'}.`
                                                        );
                                                    }}
                                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                        app.connected
                                                            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-primary text-white hover:bg-primary/90'
                                                    }`}
                                                >
                                                    {app.connected ? 'Disconnect' : 'Connect'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="material-icons-outlined text-2xl">api</span>
                                        <h3 className="font-bold">API Access</h3>
                                    </div>
                                    <p className="text-sm opacity-80 mb-4">
                                        Generate API keys to integrate ExportFlow with your systems.
                                    </p>
                                    <button
                                        onClick={() => onShowToast('info', 'API Keys', 'Opening API management...')}
                                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Manage API Keys
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Password</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onShowToast('success', 'Password Updated', 'Your password has been changed.')}
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Two-Factor Authentication</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Add an extra layer of security to your account.
                                    </p>
                                    <button
                                        onClick={() => onShowToast('info', '2FA Setup', 'Opening 2FA configuration...')}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                                    >
                                        <span className="material-icons-outlined text-sm">security</span>
                                        Enable 2FA
                                    </button>
                                </div>

                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Sessions</h3>
                                    <div className="space-y-3">
                                        {[
                                            { device: 'MacBook Pro', location: 'Mumbai, India', current: true, lastActive: 'Now' },
                                            { device: 'iPhone 15', location: 'Mumbai, India', current: false, lastActive: '2 hours ago' },
                                        ].map((session, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-icons-outlined text-gray-400">
                                                        {session.device.includes('iPhone') ? 'phone_iphone' : 'laptop_mac'}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-medium flex items-center gap-2">
                                                            {session.device}
                                                            {session.current && (
                                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-600 text-[10px] rounded">Current</span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{session.location} • {session.lastActive}</p>
                                                    </div>
                                                </div>
                                                {!session.current && (
                                                    <button className="text-sm text-red-500 hover:underline">
                                                        Revoke
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                                    <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <button
                                        onClick={() => onShowToast('error', 'Delete Account', 'Please contact support to delete your account.')}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SettingsPage;
