import React, { useState } from 'react';
import { ViewType } from '../types';

interface NavigationRailProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  showNotifications: boolean;
  onToggleNotifications: () => void;
}

const NavigationRail: React.FC<NavigationRailProps> = ({
  activeView,
  onNavigate,
  onToggleDarkMode,
  isDarkMode,
  showNotifications,
  onToggleNotifications
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems: { icon: string; view: ViewType; label: string }[] = [
    { icon: 'dashboard', view: 'dashboard', label: 'Dashboard' },
    { icon: 'request_quote', view: 'quotes', label: 'Quotes' },
    { icon: 'inventory_2', view: 'products', label: 'Products' },
    { icon: 'local_shipping', view: 'logistics', label: 'Logistics' },
    { icon: 'groups', view: 'clients', label: 'Clients' },
    { icon: 'description', view: 'documents', label: 'Documents' },
    { icon: 'analytics', view: 'reports', label: 'Reports' }
  ];

  const notifications = [
    { id: 1, title: 'Quote Approved', message: 'QT-2024-004 was approved by BuildRight', time: '5m ago', unread: true },
    { id: 2, title: 'New Client', message: 'Fashion Forward Inc completed registration', time: '1h ago', unread: true },
    { id: 3, title: 'Payment Received', message: '$12,500 received for QT-2024-002', time: '2h ago', unread: false }
  ];

  return (
    <aside className="w-16 hidden md:flex flex-col items-center py-6 border-r border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark flex-shrink-0 z-20 relative">
      {/* Logo/Home Button */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-xl hover:bg-white dark:hover:bg-surface-dark transition-all"
          aria-label="Go to home"
          title="ExportFlow"
        >
          <span className="material-icons-outlined text-primary cursor-pointer text-2xl">
            rocket_launch
          </span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-6 w-full items-center" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`p-2 rounded-xl transition-all group relative ${activeView === item.view
                ? 'bg-white dark:bg-surface-dark shadow-sm'
                : 'hover:bg-white dark:hover:bg-surface-dark'
              }`}
            title={item.label}
            aria-label={`Navigate to ${item.label}`}
            aria-current={activeView === item.view ? 'page' : undefined}
          >
            <span className={`material-icons-outlined ${activeView === item.view ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
              }`}>
              {item.icon}
            </span>

            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-4 items-center">
        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          <span className="material-icons-outlined text-gray-400 text-sm">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={onToggleNotifications}
            className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center hover:bg-orange-500/30 transition-colors"
            aria-label="Toggle notifications"
            title="Notifications"
          >
            <span className="material-icons-outlined text-orange-500 text-sm">notifications</span>
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute left-full ml-2 bottom-0 w-72 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h4 className="font-bold text-sm">Notifications</h4>
                <button className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${notif.unread ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold">{notif.title}</p>
                      <span className="text-[10px] text-gray-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-500">{notif.message}</p>
                  </div>
                ))}
              </div>
              <button className="w-full p-2 text-center text-xs text-primary hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                View All Notifications
              </button>
            </div>
          )}
        </div>

        {/* User Avatar with Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
            aria-label="Open user menu"
            title="User Menu"
          >
            <img
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 hover:border-primary transition-colors cursor-pointer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoHVDuMqRYrCutZQ_q8Dj0-cSybLoe67OMoGeusvS9_xvMMp0jISzB1Ve2iH8mKNTVlvhPWwSTcl6OzGyX2qM8RQ62kM-B436r-JPfQd23PNbX8rJTOluvxJ4m-0Q18UJaVRDyQbUtL780e2aMeKrpcGrLteDzGpzAl3z4I3yo-upg_u7Kw43yd6Dkp5e4cZE222pS_AiwUBXjbQ10OCNHvyRtp5WQ_Gd693I1yLleyW0wsl2dshSf53VXv7X74bb0H8Bb1nrTXxA"
            />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute left-full ml-2 bottom-0 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <p className="font-bold text-sm">Alex Johnson</p>
                <p className="text-xs text-gray-500">alex@exportflow.com</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                  <span className="material-icons-outlined text-sm text-gray-400">person</span>
                  Profile
                </button>
                <button 
                  onClick={() => { onNavigate('settings'); setShowUserMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                  <span className="material-icons-outlined text-sm text-gray-400">settings</span>
                  Settings
                </button>
                <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                  <span className="material-icons-outlined text-sm text-gray-400">help</span>
                  Help & Support
                </button>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                <button className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                  <span className="material-icons-outlined text-sm">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default NavigationRail;
