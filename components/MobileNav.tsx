import React from 'react';
import { ViewType } from '../types';

interface MobileNavProps {
    activeView: ViewType;
    onNavigate: (view: ViewType) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeView, onNavigate }) => {
    const navItems: { icon: string; view: ViewType; label: string }[] = [
        { icon: 'dashboard', view: 'dashboard', label: 'Home' },
        { icon: 'request_quote', view: 'quotes', label: 'Quotes' },
        { icon: 'inventory_2', view: 'products', label: 'Products' },
        { icon: 'groups', view: 'clients', label: 'Clients' },
        { icon: 'analytics', view: 'reports', label: 'Reports' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 z-50 safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => onNavigate(item.view)}
                        className={`flex flex-col items-center justify-center min-w-[64px] py-1.5 px-2 rounded-xl transition-all ${
                            activeView === item.view
                                ? 'text-primary bg-primary/10'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        aria-label={`Navigate to ${item.label}`}
                        aria-current={activeView === item.view ? 'page' : undefined}
                    >
                        <span className={`material-icons-outlined text-xl ${
                            activeView === item.view ? 'text-primary' : ''
                        }`}>
                            {item.icon}
                        </span>
                        <span className={`text-[10px] mt-0.5 font-medium ${
                            activeView === item.view ? 'text-primary' : ''
                        }`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default MobileNav;
