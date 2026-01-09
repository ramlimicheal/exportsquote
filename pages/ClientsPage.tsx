import React, { useState, useMemo } from 'react';
import { CLIENTS, RECENT_QUOTES } from '../constants';
import { Client, Quote } from '../types';

interface ClientsPageProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
    onNavigate: (view: 'quotes' | 'products' | 'logistics' | 'clients' | 'reports') => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ onShowToast, onNavigate }) => {
    const [clients, setClients] = useState<Client[]>(Object.values(CLIENTS).filter(c => c.id !== 'me'));
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');

    // Form state
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        location: '',
        creditLimit: '',
        preferredIncoterm: 'FOB' as Client['preferredIncoterm'],
        status: 'active' as Client['status']
    });

    const filteredClients = useMemo(() => {
        let result = clients;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.companyName.toLowerCase().includes(q) ||
                c.contactName.toLowerCase().includes(q) ||
                c.location.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }
        return result;
    }, [clients, searchQuery, statusFilter]);

    const getClientQuotes = (clientId: string) => {
        return RECENT_QUOTES.filter(q => q.client?.id === clientId);
    };

    const openAddModal = () => {
        setEditingClient(null);
        setFormData({
            companyName: '', contactName: '', location: '',
            creditLimit: '', preferredIncoterm: 'FOB', status: 'active'
        });
        setShowModal(true);
    };

    const openEditModal = (client: Client) => {
        setEditingClient(client);
        setFormData({
            companyName: client.companyName,
            contactName: client.contactName,
            location: client.location,
            creditLimit: client.creditLimit || '',
            preferredIncoterm: client.preferredIncoterm || 'FOB',
            status: client.status
        });
        setShowModal(true);
    };

    const handleSave = () => {
        const newClient: Client = {
            id: editingClient?.id || `c-${Date.now()}`,
            companyName: formData.companyName,
            contactName: formData.contactName,
            avatar: editingClient?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.companyName)}&background=7C7CE0&color=fff`,
            location: formData.location,
            creditLimit: formData.creditLimit,
            preferredIncoterm: formData.preferredIncoterm,
            status: formData.status
        };

        if (editingClient) {
            setClients(prev => prev.map(c => c.id === editingClient.id ? newClient : c));
            onShowToast('success', 'Client Updated', newClient.companyName);
        } else {
            setClients(prev => [...prev, newClient]);
            onShowToast('success', 'Client Added', newClient.companyName);
        }
        setShowModal(false);
        if (selectedClient?.id === editingClient?.id) {
            setSelectedClient(newClient);
        }
    };

    const statusColors = {
        active: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
        inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    };
    
    // Calculate risk score for a client (AI-simulated)
    const calculateRiskScore = (client: Client): { score: number; level: 'low' | 'medium' | 'high'; factors: string[] } => {
        const quotes = getClientQuotes(client.id);
        const approvedQuotes = quotes.filter(q => q.status === 'Approved').length;
        const conversionRate = quotes.length > 0 ? (approvedQuotes / quotes.length) * 100 : 50;
        
        let score = 75; // Base score
        const factors: string[] = [];
        
        // Adjust based on status
        if (client.status === 'active') score += 10;
        if (client.status === 'pending') { score -= 10; factors.push('New client - limited history'); }
        if (client.status === 'inactive') { score -= 30; factors.push('Inactive client'); }
        
        // Adjust based on conversion
        if (conversionRate >= 80) score += 10;
        if (conversionRate < 50) { score -= 15; factors.push('Low conversion rate'); }
        
        // Adjust based on credit
        const creditLimit = parseInt((client.creditLimit || '$0').replace(/[$,]/g, ''));
        if (creditLimit >= 100000) score += 5;
        if (creditLimit < 25000) { factors.push('Low credit limit'); }
        
        // Risk score based on tier if available
        if ((client as any).riskScore) {
            score = Math.round(((client as any).riskScore / 100) * score + score * 0.5);
        }
        
        score = Math.max(0, Math.min(100, score));
        const level: 'low' | 'medium' | 'high' = score >= 70 ? 'low' : score >= 40 ? 'medium' : 'high';
        
        return { score, level, factors };
    };
    
    // Generate AI recommendations for client
    const getAIRecommendations = (client: Client): Array<{type: string; text: string; priority: 'high' | 'medium' | 'low'}> => {
        const quotes = getClientQuotes(client.id);
        const recommendations: Array<{type: string; text: string; priority: 'high' | 'medium' | 'low'}> = [];
        
        if (quotes.length === 0) {
            recommendations.push({ type: 'quote', text: 'Create initial quote to establish relationship', priority: 'high' });
        }
        
        if (client.status === 'pending') {
            recommendations.push({ type: 'onboarding', text: 'Complete client verification process', priority: 'high' });
        }
        
        const pendingQuotes = quotes.filter(q => q.status === 'Sent');
        if (pendingQuotes.length > 0) {
            recommendations.push({ type: 'followup', text: `Follow up on ${pendingQuotes.length} pending quote(s)`, priority: 'medium' });
        }
        
        if (quotes.length >= 3) {
            recommendations.push({ type: 'upsell', text: 'Consider volume discount or credit increase', priority: 'low' });
        }
        
        if ((client as any).industry === 'textiles') {
            recommendations.push({ type: 'product', text: 'New Cotton Premium line matches client profile', priority: 'medium' });
        }
        
        return recommendations.slice(0, 3);
    };

    return (
        <main className="flex-1 flex h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Client List */}
            <div className="w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Clients</h1>
                        <button
                            onClick={openAddModal}
                            className="p-2 bg-primary text-white rounded-full hover:bg-primary/90"
                            title="Add Client"
                        >
                            <span className="material-icons-outlined text-sm">add</span>
                        </button>
                    </div>

                    <div className="relative mb-3">
                        <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400 text-sm">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-surface-light dark:bg-surface-dark rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Search clients..."
                        />
                    </div>

                    <div className="flex gap-1">
                        {(['all', 'active', 'pending', 'inactive'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === status
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {filteredClients.length === 0 ? (
                        <div className="py-12 text-center text-gray-400">
                            <span className="material-icons-outlined text-4xl">people_outline</span>
                            <p className="mt-2">No clients found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredClients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${selectedClient?.id === client.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={client.avatar}
                                            alt={client.companyName}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold truncate">{client.companyName}</p>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColors[client.status]}`}>
                                                    {client.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{client.contactName} • {client.location}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Client Details */}
            <div className="flex-1 overflow-y-auto">
                {selectedClient ? (
                    <div className="p-8">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={selectedClient.avatar}
                                        alt={selectedClient.companyName}
                                        className="w-16 h-16 rounded-full border-4 border-white/20"
                                    />
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold">{selectedClient.companyName}</h2>
                                        <p className="opacity-80">{selectedClient.contactName}</p>
                                    </div>
                                    <button
                                        onClick={() => openEditModal(selectedClient)}
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                    >
                                        <span className="material-icons-outlined">edit</span>
                                    </button>
                                </div>
                            </div>

                            {/* Risk Score Badge */}
                            {(() => {
                                const risk = calculateRiskScore(selectedClient);
                                return (
                                    <div className={`mx-6 -mt-4 mb-4 p-3 rounded-xl border flex items-center gap-3 ${
                                        risk.level === 'low' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                                        risk.level === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                    }`}>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                            risk.level === 'low' ? 'bg-green-500 text-white' :
                                            risk.level === 'medium' ? 'bg-yellow-500 text-white' :
                                            'bg-red-500 text-white'
                                        }`}>
                                            {risk.score}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Risk Score: {risk.level === 'low' ? 'Low Risk' : risk.level === 'medium' ? 'Medium Risk' : 'High Risk'}
                                            </p>
                                            {risk.factors.length > 0 && (
                                                <p className="text-xs text-gray-500">
                                                    {risk.factors.join(' • ')}
                                                </p>
                                            )}
                                        </div>
                                        <span className="material-icons-outlined text-gray-400">security</span>
                                    </div>
                                );
                            })()}

                            {/* Stats */}
                            <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-100 dark:border-gray-700">
                                <div className="p-4 text-center">
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {getClientQuotes(selectedClient.id).length}
                                    </p>
                                    <p className="text-xs text-gray-500">Total Quotes</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {selectedClient.creditLimit || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500">Credit Limit</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {selectedClient.preferredIncoterm || 'FOB'}
                                    </p>
                                    <p className="text-xs text-gray-500">Pref. Incoterm</p>
                                </div>
                                <div className="p-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedClient.status]}`}>
                                        {selectedClient.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">Status</p>
                                </div>
                            </div>
                            
                            {/* AI Recommendations */}
                            {(() => {
                                const recommendations = getAIRecommendations(selectedClient);
                                if (recommendations.length === 0) return null;
                                return (
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800/30">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-icons-outlined text-purple-500">auto_awesome</span>
                                            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">AI Recommendations</span>
                                        </div>
                                        <div className="space-y-2">
                                            {recommendations.map((rec, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        rec.priority === 'high' ? 'bg-red-500' :
                                                        rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                                                    }`} />
                                                    <span className="text-gray-700 dark:text-gray-300">{rec.text}</span>
                                                    <button 
                                                        onClick={() => onShowToast('info', 'Action', `${rec.type} action initiated...`)}
                                                        className="ml-auto text-purple-600 hover:underline text-xs"
                                                    >
                                                        Take Action
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Details */}
                            <div className="p-6 grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <span className="material-icons-outlined text-primary">info</span>
                                        Contact Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="material-icons-outlined text-gray-400">person</span>
                                            <span>{selectedClient.contactName}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="material-icons-outlined text-gray-400">location_on</span>
                                            <span>{selectedClient.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="material-icons-outlined text-gray-400">email</span>
                                            <span className="text-primary">contact@{selectedClient.companyName.toLowerCase().replace(/\s+/g, '')}.com</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <span className="material-icons-outlined text-primary">account_balance_wallet</span>
                                        Credit & Billing
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">Credit Used</span>
                                            <span className="font-semibold">$12,500 / {selectedClient.creditLimit || '$0'}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">25% credit utilized</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quote History */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <span className="material-icons-outlined text-primary">history</span>
                                        Quote History
                                    </h3>
                                    <button
                                        onClick={() => onNavigate('quotes')}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>

                                {getClientQuotes(selectedClient.id).length === 0 ? (
                                    <div className="py-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <span className="material-icons-outlined text-3xl">description</span>
                                        <p className="mt-2 text-sm">No quotes yet</p>
                                        <button className="mt-2 text-primary text-sm hover:underline">
                                            Create First Quote
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {getClientQuotes(selectedClient.id).map(quote => (
                                            <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                <div>
                                                    <p className="font-medium">{quote.reference}</p>
                                                    <p className="text-xs text-gray-500">{quote.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">${quote.total?.toLocaleString()}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded ${quote.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                                            quote.status === 'Sent' ? 'bg-blue-100 text-blue-600' :
                                                                'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {quote.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="material-icons-outlined text-6xl mb-4">person_search</span>
                        <p className="text-lg font-medium">Select a client to view details</p>
                        <p className="text-sm">Or add a new client to get started</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-lg">{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Acme Corp"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Name *</label>
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                    placeholder="Mumbai, MH"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credit Limit</label>
                                    <input
                                        type="text"
                                        value={formData.creditLimit}
                                        onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                        placeholder="$50,000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pref. Incoterm</label>
                                    <select
                                        value={formData.preferredIncoterm}
                                        onChange={(e) => setFormData(prev => ({ ...prev, preferredIncoterm: e.target.value as Client['preferredIncoterm'] }))}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                    >
                                        <option value="EXW">EXW</option>
                                        <option value="FOB">FOB</option>
                                        <option value="CIF">CIF</option>
                                        <option value="DDP">DDP</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <div className="flex gap-2">
                                    {(['active', 'pending', 'inactive'] as const).map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, status }))}
                                            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${formData.status === status
                                                    ? statusColors[status]
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                                }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.companyName || !formData.contactName}
                                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                                {editingClient ? 'Save Changes' : 'Add Client'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ClientsPage;
