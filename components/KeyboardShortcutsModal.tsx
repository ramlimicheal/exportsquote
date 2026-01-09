import React from 'react';

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ShortcutGroup {
    title: string;
    shortcuts: { keys: string[]; description: string }[];
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
    const shortcutGroups: ShortcutGroup[] = [
        {
            title: 'General',
            shortcuts: [
                { keys: ['⌘', 'K'], description: 'Open command palette' },
                { keys: ['?'], description: 'Show keyboard shortcuts' },
                { keys: ['Esc'], description: 'Close modal / Cancel' },
                { keys: ['⌘', '/'], description: 'Toggle AI assistant' },
            ],
        },
        {
            title: 'Navigation',
            shortcuts: [
                { keys: ['G', 'D'], description: 'Go to Dashboard' },
                { keys: ['G', 'Q'], description: 'Go to Quotes' },
                { keys: ['G', 'P'], description: 'Go to Products' },
                { keys: ['G', 'L'], description: 'Go to Logistics' },
                { keys: ['G', 'C'], description: 'Go to Clients' },
                { keys: ['G', 'R'], description: 'Go to Reports' },
                { keys: ['G', 'S'], description: 'Go to Settings' },
            ],
        },
        {
            title: 'Quotes',
            shortcuts: [
                { keys: ['N'], description: 'Create new quote' },
                { keys: ['⌘', 'S'], description: 'Save current quote' },
                { keys: ['⌘', 'P'], description: 'Print quote' },
                { keys: ['⌘', 'E'], description: 'Export quote as PDF' },
                { keys: ['⌘', 'Enter'], description: 'Send quote' },
            ],
        },
        {
            title: 'Lists & Tables',
            shortcuts: [
                { keys: ['↑', '↓'], description: 'Navigate items' },
                { keys: ['Enter'], description: 'Select / Open item' },
                { keys: ['⌘', 'A'], description: 'Select all' },
                { keys: ['Delete'], description: 'Delete selected' },
                { keys: ['/'], description: 'Focus search' },
            ],
        },
        {
            title: 'Appearance',
            shortcuts: [
                { keys: ['⌘', 'D'], description: 'Toggle dark mode' },
                { keys: ['⌘', '+'], description: 'Zoom in' },
                { keys: ['⌘', '-'], description: 'Zoom out' },
                { keys: ['⌘', '0'], description: 'Reset zoom' },
            ],
        },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-3xl mx-4 max-h-[85vh] bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="material-icons-outlined text-primary">keyboard</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Keyboard Shortcuts</h2>
                            <p className="text-xs text-gray-500">Boost your productivity with these shortcuts</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <span className="material-icons-outlined text-gray-400">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {shortcutGroups.map((group) => (
                            <div key={group.title} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    {group.title}
                                </h3>
                                <div className="space-y-2">
                                    {group.shortcuts.map((shortcut, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between py-1.5"
                                        >
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {shortcut.description}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, keyIndex) => (
                                                    <React.Fragment key={keyIndex}>
                                                        <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                                                            {key}
                                                        </kbd>
                                                        {keyIndex < shortcut.keys.length - 1 && (
                                                            <span className="text-gray-400 text-xs">+</span>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pro Tip */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl border border-primary/20">
                        <div className="flex items-start gap-3">
                            <span className="material-icons-outlined text-primary">tips_and_updates</span>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white mb-1">Pro Tip</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Press <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-800 rounded border">⌘</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-800 rounded border">K</kbd> anywhere to quickly search and navigate. 
                                    You can type commands, search for clients, products, or quotes all from one place!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">?</kbd> anytime to show this help
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
