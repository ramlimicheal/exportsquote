import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ViewType, Client, Product, Quote } from '../types';
import { CLIENTS, PRODUCTS, RECENT_QUOTES, INITIAL_QUOTE } from '../constants';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: ViewType) => void;
    onSelectQuote: (quote: Partial<Quote>) => void;
    onSelectClient: (client: Client) => void;
    onCreateQuote: () => void;
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
    onToggleDarkMode: () => void;
    isDarkMode: boolean;
}

interface CommandItem {
    id: string;
    name: string;
    description?: string;
    icon: string;
    category: 'navigation' | 'action' | 'search' | 'recent' | 'client' | 'product' | 'quote';
    shortcut?: string;
    action: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
    isOpen,
    onClose,
    onNavigate,
    onSelectQuote,
    onSelectClient,
    onCreateQuote,
    onShowToast,
    onToggleDarkMode,
    isDarkMode
}) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Define all available commands
    const allCommands: CommandItem[] = useMemo(() => {
        const navigationCommands: CommandItem[] = [
            { id: 'nav-dashboard', name: 'Go to Dashboard', icon: 'dashboard', category: 'navigation', shortcut: 'G D', action: () => { onNavigate('dashboard'); onClose(); } },
            { id: 'nav-quotes', name: 'Go to Quotes', icon: 'request_quote', category: 'navigation', shortcut: 'G Q', action: () => { onNavigate('quotes'); onClose(); } },
            { id: 'nav-products', name: 'Go to Products', icon: 'inventory_2', category: 'navigation', shortcut: 'G P', action: () => { onNavigate('products'); onClose(); } },
            { id: 'nav-logistics', name: 'Go to Logistics', icon: 'local_shipping', category: 'navigation', shortcut: 'G L', action: () => { onNavigate('logistics'); onClose(); } },
            { id: 'nav-clients', name: 'Go to Clients', icon: 'groups', category: 'navigation', shortcut: 'G C', action: () => { onNavigate('clients'); onClose(); } },
            { id: 'nav-documents', name: 'Go to Documents', icon: 'description', category: 'navigation', shortcut: 'G O', action: () => { onNavigate('documents'); onClose(); } },
            { id: 'nav-reports', name: 'Go to Reports', icon: 'analytics', category: 'navigation', shortcut: 'G R', action: () => { onNavigate('reports'); onClose(); } },
        ];

        const actionCommands: CommandItem[] = [
            { id: 'action-new-quote', name: 'Create New Quote', description: 'Start a new export quote', icon: 'add_circle', category: 'action', shortcut: 'N', action: () => { onCreateQuote(); onNavigate('quotes'); onClose(); } },
            { id: 'action-toggle-theme', name: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode', icon: isDarkMode ? 'light_mode' : 'dark_mode', category: 'action', shortcut: 'T', action: () => { onToggleDarkMode(); onClose(); } },
            { id: 'action-export-data', name: 'Export All Data', description: 'Download data as CSV', icon: 'download', category: 'action', action: () => { onShowToast('info', 'Export Started', 'Preparing your data...'); onClose(); } },
            { id: 'action-ai-assist', name: 'AI Assistant', description: 'Get smart suggestions', icon: 'auto_awesome', category: 'action', shortcut: 'A', action: () => { onShowToast('info', 'AI Assistant', 'Analyzing your data...'); onClose(); } },
            { id: 'action-search-hs', name: 'Search HS Codes', description: 'Find harmonized system codes', icon: 'search', category: 'action', action: () => { onNavigate('products'); onShowToast('info', 'HS Code Search', 'Search products by HS code'); onClose(); } },
            { id: 'action-container-calc', name: 'Container Calculator', description: 'Calculate container requirements', icon: 'calculate', category: 'action', action: () => { onNavigate('logistics'); onClose(); } },
        ];

        // Client commands
        const clientCommands: CommandItem[] = Object.values(CLIENTS)
            .filter(c => c.id !== 'me')
            .map(client => ({
                id: `client-${client.id}`,
                name: client.companyName,
                description: `${client.contactName} • ${client.location}`,
                icon: 'business',
                category: 'client' as const,
                action: () => { onSelectClient(client); onNavigate('clients'); onClose(); }
            }));

        // Product commands
        const productCommands: CommandItem[] = PRODUCTS.slice(0, 8).map(product => ({
            id: `product-${product.id}`,
            name: product.name,
            description: `SKU: ${product.sku} • $${product.unitPrice}/${product.unit}`,
            icon: product.icon,
            category: 'product' as const,
            action: () => { onNavigate('products'); onShowToast('info', 'Product Selected', product.name); onClose(); }
        }));

        // Recent quote commands
        const quoteCommands: CommandItem[] = [INITIAL_QUOTE, ...RECENT_QUOTES].slice(0, 5).map(quote => ({
            id: `quote-${quote.id}`,
            name: quote.reference || 'New Quote',
            description: `${quote.client?.companyName || 'No client'} • $${quote.total?.toLocaleString() || '0'}`,
            icon: 'description',
            category: 'quote' as const,
            action: () => { onSelectQuote(quote); onNavigate('quotes'); onClose(); }
        }));

        return [...navigationCommands, ...actionCommands, ...quoteCommands, ...clientCommands, ...productCommands];
    }, [onNavigate, onClose, onCreateQuote, onToggleDarkMode, onShowToast, onSelectClient, onSelectQuote, isDarkMode]);

    // Filter commands based on query
    const filteredCommands = useMemo(() => {
        if (!query.trim()) {
            // Show recent and navigation by default
            if (activeCategory) {
                return allCommands.filter(c => c.category === activeCategory);
            }
            return allCommands.filter(c => ['navigation', 'action', 'recent'].includes(c.category)).slice(0, 10);
        }

        const searchTerm = query.toLowerCase();
        return allCommands.filter(cmd =>
            cmd.name.toLowerCase().includes(searchTerm) ||
            cmd.description?.toLowerCase().includes(searchTerm) ||
            cmd.category.includes(searchTerm)
        ).slice(0, 15);
    }, [query, allCommands, activeCategory]);

    // Group commands by category for display
    const groupedCommands = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        filteredCommands.forEach(cmd => {
            if (!groups[cmd.category]) {
                groups[cmd.category] = [];
            }
            groups[cmd.category].push(cmd);
        });
        return groups;
    }, [filteredCommands]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setActiveCategory(null);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Attach keyboard listener
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current) {
            const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            selectedEl?.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex]);

    if (!isOpen) return null;

    const categoryLabels: Record<string, string> = {
        navigation: '🧭 Navigation',
        action: '⚡ Actions',
        recent: '🕐 Recent',
        client: '🏢 Clients',
        product: '📦 Products',
        quote: '📋 Quotes',
        search: '🔍 Search'
    };

    const categoryIcons: Record<string, string> = {
        navigation: 'explore',
        action: 'bolt',
        recent: 'history',
        client: 'business',
        product: 'inventory_2',
        quote: 'description',
        search: 'search'
    };

    let flatIndex = 0;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Command Palette */}
            <div className="relative min-h-screen flex items-start justify-center pt-[15vh] px-4">
                <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all">
                    {/* Search Input */}
                    <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="material-icons-outlined text-gray-400 mr-3">search</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                            placeholder="Search commands, clients, products, quotes..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 text-lg"
                        />
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">ESC</kbd>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                !activeCategory ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {['navigation', 'action', 'quote', 'client', 'product'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                    activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                }`}
                            >
                                <span className="material-icons-outlined text-xs">{categoryIcons[cat]}</span>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}s
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
                        {filteredCommands.length === 0 ? (
                            <div className="py-12 text-center text-gray-400">
                                <span className="material-icons-outlined text-4xl mb-2">search_off</span>
                                <p className="text-sm">No commands found for "{query}"</p>
                                <p className="text-xs mt-1">Try a different search term</p>
                            </div>
                        ) : (
                            Object.entries(groupedCommands).map(([category, commands]) => (
                                <div key={category} className="mb-3">
                                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {categoryLabels[category] || category}
                                    </div>
                                    {commands.map((cmd) => {
                                        const currentIndex = flatIndex++;
                                        const isSelected = currentIndex === selectedIndex;
                                        return (
                                            <button
                                                key={cmd.id}
                                                data-index={currentIndex}
                                                onClick={cmd.action}
                                                onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                                    isSelected
                                                        ? 'bg-primary/10 dark:bg-primary/20'
                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    isSelected
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                                }`}>
                                                    <span className="material-icons-outlined text-sm">{cmd.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium truncate ${isSelected ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>
                                                        {cmd.name}
                                                    </p>
                                                    {cmd.description && (
                                                        <p className="text-xs text-gray-500 truncate">{cmd.description}</p>
                                                    )}
                                                </div>
                                                {cmd.shortcut && (
                                                    <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
                                                        {cmd.shortcut}
                                                    </kbd>
                                                )}
                                                {isSelected && (
                                                    <span className="material-icons-outlined text-primary text-sm">arrow_forward</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>
                                <span>Navigate</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd>
                                <span>Select</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">ESC</kbd>
                                <span>Close</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="material-icons-outlined text-xs">auto_awesome</span>
                            <span>ExportFlow Pro</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
