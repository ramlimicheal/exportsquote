import React, { useState, useCallback } from 'react';
import NavigationRail from './components/NavigationRail';
import DirectorySidebar from './components/DirectorySidebar';
import ChatInterface from './components/ChatInterface';
import DetailsPanel from './components/DetailsPanel';
import Toast, { ToastMessage } from './components/Toast';
import ProductsPage from './pages/ProductsPage';
import LogisticsPage from './pages/LogisticsPage';
import ClientsPage from './pages/ClientsPage';
import ReportsPage from './pages/ReportsPage';
import { ViewType, Quote, Client } from './types';
import { INITIAL_QUOTE, CLIENTS } from './constants';

const App: React.FC = () => {
    // State management
    const [activeView, setActiveView] = useState<ViewType>('quotes');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<Partial<Quote> | null>(INITIAL_QUOTE);
    const [selectedClient, setSelectedClient] = useState<Client | null>(CLIENTS.tech_corp);
    const [showDetailsPanel, setShowDetailsPanel] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

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
            case 'products':
                return <ProductsPage onShowToast={showToast} />;
            case 'logistics':
                return <LogisticsPage onShowToast={showToast} />;
            case 'clients':
                return <ClientsPage onShowToast={showToast} onNavigate={handleNavigate} />;
            case 'reports':
                return <ReportsPage onShowToast={showToast} />;
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
        <div className={`flex h-screen w-full bg-background-light dark:bg-background-dark text-text-main dark:text-gray-200 ${isDarkMode ? 'dark' : ''}`}>
            {/* Left Navigation Rail */}
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
        </div>
    );
};

export default App;
