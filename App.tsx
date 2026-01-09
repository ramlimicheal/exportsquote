import React, { useState, useCallback, useEffect } from 'react';
import NavigationRail from './components/NavigationRail';
import DirectorySidebar from './components/DirectorySidebar';
import ChatInterface from './components/ChatInterface';
import DetailsPanel from './components/DetailsPanel';
import Toast, { ToastMessage } from './components/Toast';
import CommandPalette from './components/CommandPalette';
import MobileNav from './components/MobileNav';
import OnboardingModal from './components/OnboardingModal';
import ErrorBoundary from './components/ErrorBoundary';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import LogisticsPage from './pages/LogisticsPage';
import ClientsPage from './pages/ClientsPage';
import ReportsPage from './pages/ReportsPage';
import DocumentsPage from './pages/DocumentsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { ViewType, Quote, Client } from './types';
import { INITIAL_QUOTE, CLIENTS } from './constants';

const App: React.FC = () => {
    // State management
const [activeView, setActiveView] = useState<ViewType>('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<Partial<Quote> | null>(INITIAL_QUOTE);
    const [selectedClient, setSelectedClient] = useState<Client | null>(CLIENTS.tech_corp);
    const [showDetailsPanel, setShowDetailsPanel] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(() => {
        // Show onboarding if user hasn't completed it
        return !localStorage.getItem('exportflow_onboarding_complete');
    });
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

    // Keyboard shortcuts handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input/textarea
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            // Command Palette: CMD+K / Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowCommandPalette(prev => !prev);
                return;
            }

            // Show keyboard shortcuts: ?
            if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setShowKeyboardShortcuts(prev => !prev);
                return;
            }

            // Dark mode toggle: CMD+D / Ctrl+D
            if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
                e.preventDefault();
                handleToggleDarkMode();
                return;
            }

            // Quick navigation shortcuts (G followed by a letter)
            // This is a simplified version - full implementation would use a key sequence tracker
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Toast management
    const showToast = useCallback((type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
        const id = `toast-${Date.now()}`;
        setToasts(prev => [...prev, { id, type, title, message }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Navigation
    const handleNavigate = useCallback((view: ViewType) => {
        setActiveView(view);
        setShowDetailsPanel(true); // Reset details panel on navigation
    }, []);

    // Quote selection
    const handleSelectQuote = useCallback((quote: Partial<Quote>) => {
        setSelectedQuote(quote);
        if (quote.client) {
            setSelectedClient(quote.client);
        }
        showToast('success', 'Quote Selected', `${quote.reference} loaded`);
    }, [showToast]);

    // Client selection
    const handleSelectClient = useCallback((client: Client) => {
        setSelectedClient(client);
        showToast('info', 'Client Selected', client.companyName);
    }, [showToast]);

    // Create new quote
    const handleCreateQuote = useCallback(() => {
        const newQuote: Partial<Quote> = {
            id: `q-${Date.now()}`,
            reference: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            status: 'Draft',
            date: new Date().toLocaleDateString(),
            items: [],
            total: 0
        };
        setSelectedQuote(newQuote);
        showToast('success', 'New Quote Created', newQuote.reference);
    }, [showToast]);

    // Dark mode toggle
    const handleToggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => !prev);
        document.documentElement.classList.toggle('dark');
    }, []);

    // Close details panel
    const handleClosePanel = useCallback(() => {
        setShowDetailsPanel(false);
    }, []);

    // Notification toggle
    const handleToggleNotifications = useCallback(() => {
        setShowNotifications(prev => !prev);
    }, []);

    // Render main content based on active view
    const renderMainContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardPage onShowToast={showToast} onNavigate={handleNavigate} />;
            case 'products':
                return <ProductsPage onShowToast={showToast} />;
            case 'logistics':
                return <LogisticsPage onShowToast={showToast} />;
            case 'clients':
                return <ClientsPage onShowToast={showToast} onNavigate={handleNavigate} />;
            case 'reports':
                return <ReportsPage onShowToast={showToast} />;
            case 'documents':
                return <DocumentsPage onShowToast={showToast} />;
            case 'settings':
                return <SettingsPage onShowToast={showToast} isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} />;
            case 'profile':
                return <ProfilePage onShowToast={showToast} onNavigate={handleNavigate} />;
            case 'quotes':
            default:
                return (
                    <>
                        {/* Directory Sidebar */}
                        <DirectorySidebar
                            className="hidden lg:flex"
                            activeView={activeView}
                            onNavigate={handleNavigate}
                            onSelectQuote={handleSelectQuote}
                            onSelectClient={handleSelectClient}
                            onCreateQuote={handleCreateQuote}
                            onShowToast={showToast}
                            selectedQuoteId={selectedQuote?.id}
                        />

                        {/* Main Chat Area */}
                        <ChatInterface
                            selectedQuote={selectedQuote}
                            onShowToast={showToast}
                            onSelectClient={handleSelectClient}
                        />

                        {/* Right Details Panel */}
                        {showDetailsPanel && (
                            <DetailsPanel
                                className="hidden xl:flex"
                                selectedClient={selectedClient}
                                selectedQuote={selectedQuote}
                                onClose={handleClosePanel}
                                onShowToast={showToast}
                            />
                        )}
                    </>
                );
        }
    };

    return (
        <ErrorBoundary>
        <div className={`flex h-screen w-full bg-background-light dark:bg-background-dark text-text-main dark:text-gray-200 pb-[64px] md:pb-0 ${isDarkMode ? 'dark' : ''}`}>
            {/* Left Navigation Rail (Desktop) */}
            <NavigationRail
                activeView={activeView}
                onNavigate={handleNavigate}
                onToggleDarkMode={handleToggleDarkMode}
                isDarkMode={isDarkMode}
                showNotifications={showNotifications}
                onToggleNotifications={handleToggleNotifications}
            />

            {/* Main Content Area */}
            {renderMainContent()}

            {/* Toast Notifications */}
            <Toast toasts={toasts} onRemove={removeToast} />

            {/* Command Palette (CMD+K) */}
            <CommandPalette
                isOpen={showCommandPalette}
                onClose={() => setShowCommandPalette(false)}
                onNavigate={handleNavigate}
                onSelectQuote={handleSelectQuote}
                onSelectClient={handleSelectClient}
                onCreateQuote={handleCreateQuote}
                onShowToast={showToast}
                onToggleDarkMode={handleToggleDarkMode}
                isDarkMode={isDarkMode}
            />

            {/* Mobile Bottom Navigation */}
            <MobileNav activeView={activeView} onNavigate={handleNavigate} />

            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                onNavigate={handleNavigate}
            />

            {/* Keyboard Shortcuts Modal */}
            <KeyboardShortcutsModal
                isOpen={showKeyboardShortcuts}
                onClose={() => setShowKeyboardShortcuts(false)}
            />
        </div>
        </ErrorBoundary>
    );
};

export default App;
