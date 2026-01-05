import React, { useState, useMemo } from 'react';
import { CLIENTS, RECENT_QUOTES, INITIAL_QUOTE } from '../constants';
import { Quote, Client, ViewType, QuoteStatusFilter } from '../types';

interface DirectorySidebarProps {
  className?: string;
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  onSelectQuote: (quote: Partial<Quote>) => void;
  onSelectClient: (client: Client) => void;
  onCreateQuote: () => void;
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
  selectedQuoteId?: string;
}

const DirectorySidebar: React.FC<DirectorySidebarProps> = ({
  className = "",
  activeView,
  onNavigate,
  onSelectQuote,
  onSelectClient,
  onCreateQuote,
  onShowToast,
  selectedQuoteId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<QuoteStatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  // All quotes including the initial one
  const allQuotes = useMemo(() => {
    return [INITIAL_QUOTE, ...RECENT_QUOTES] as Partial<Quote>[];
  }, []);

  // Filter quotes based on search and status
  const filteredQuotes = useMemo(() => {
    return allQuotes.filter(quote => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        quote.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.client?.companyName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = activeFilter === 'all' || quote.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allQuotes, searchQuery, activeFilter]);

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    const clientList = [CLIENTS.tech_corp, CLIENTS.fash_inc, CLIENTS.build_co];
    if (searchQuery === '') return clientList;

    return clientList.filter(client =>
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filterOptions: { icon: string; label: string; filter: QuoteStatusFilter; count?: number }[] = [
    { icon: 'pending_actions', label: 'Drafts', filter: 'Draft', count: allQuotes.filter(q => q.status === 'Draft').length },
    { icon: 'send', label: 'Sent Quotes', filter: 'Sent', count: allQuotes.filter(q => q.status === 'Sent').length },
    { icon: 'check_circle_outline', label: 'Approved', filter: 'Approved', count: allQuotes.filter(q => q.status === 'Approved').length },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filter: QuoteStatusFilter) => {
    setActiveFilter(prev => prev === filter ? 'all' : filter);
  };

  const handleQuoteClick = (quote: Partial<Quote>) => {
    onSelectQuote(quote);
  };

  const handleClientClick = (client: Client) => {
    onSelectClient(client);
    onShowToast('info', 'Client Selected', `Viewing ${client.companyName}`);
  };

  const handleViewReport = () => {
    onNavigate('reports');
    onShowToast('info', 'Opening Reports', 'Loading export metrics...');
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <aside className={`w-80 flex flex-col bg-background-light dark:bg-background-dark border-r border-gray-200 dark:border-gray-800 flex-shrink-0 overflow-y-auto px-6 py-6 scrollbar-hide ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">QuickQuote</h1>
        <button
          onClick={handleToggleFilters}
          className={`p-1 rounded-full transition-colors ${showFilters ? 'bg-primary/20 text-primary' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          aria-label="Toggle filters"
          title="Toggle filters"
        >
          <span className="material-icons-outlined text-gray-400 text-lg">filter_list</span>
        </button>
      </div>

      {/* Search Input - Fully Functional */}
      <div className="relative mb-6">
        <span className="material-icons-outlined absolute left-3 top-3 text-gray-400">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 bg-surface-light dark:bg-surface-dark rounded-xl border-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-primary/50"
          placeholder="Search items or clients..."
          aria-label="Search quotes and clients"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <span className="material-icons-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Status Filters - Fully Functional */}
      <div className={`flex flex-col gap-2 mb-6 ${showFilters ? '' : 'hidden'}`}>
        {filterOptions.map((item) => (
          <button
            key={item.label}
            onClick={() => handleFilterClick(item.filter)}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group transition-colors ${activeFilter === item.filter
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-surface-light dark:hover:bg-surface-dark'
              }`}
            aria-pressed={activeFilter === item.filter}
          >
            <div className="flex items-center gap-3">
              <span className={`material-icons-outlined transition-colors ${activeFilter === item.filter ? 'text-primary' : 'text-gray-500 group-hover:text-primary'
                }`}>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.count !== undefined && item.count > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeFilter === item.filter
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary'
                }`}>
                {item.count}
              </span>
            )}
          </button>
        ))}

        {activeFilter !== 'all' && (
          <button
            onClick={() => setActiveFilter('all')}
            className="text-xs text-gray-500 hover:text-primary mt-1"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Export Metrics Card */}
      <div className="bg-card-dark rounded-2xl p-5 mb-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-semibold text-gray-200">Export Metrics</h3>
          <button
            onClick={handleViewReport}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="View insights"
            title="View detailed insights"
          >
            <span className="material-icons-outlined text-sm cursor-pointer">insights</span>
          </button>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold">$42.5k</span>
            <span className="text-xs text-green-400 mb-1">+12% vs last week</span>
          </div>
          <div className="h-2 w-full bg-gray-600 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-secondary rounded-full transition-all duration-500"></div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleViewReport}
            className="w-full bg-white/10 hover:bg-white/20 text-xs py-2 rounded-lg transition-colors border border-white/10"
          >
            View Report
          </button>
        </div>
      </div>

      {/* Recent Quotes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {activeFilter === 'all' ? 'Recent Quotes' : `${activeFilter} Quotes`}
            {searchQuery && ` (${filteredQuotes.length})`}
          </h3>
          <button
            onClick={onCreateQuote}
            className="text-gray-400 hover:text-primary text-xl transition-colors"
            aria-label="Create new quote"
            title="Create new quote"
          >
            +
          </button>
        </div>

        {/* Quote List - Filtered and Clickable */}
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <span className="material-icons-outlined text-4xl mb-2">search_off</span>
            <p className="text-sm">No quotes found</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="text-xs text-primary hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredQuotes.map((quote) => (
            <button
              key={quote.id}
              onClick={() => handleQuoteClick(quote)}
              className={`w-full flex items-center gap-3 p-2 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer text-left ${selectedQuoteId === quote.id
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-white dark:bg-surface-dark border-2 border-transparent'
                }`}
              aria-selected={selectedQuoteId === quote.id}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={quote.client?.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h4 className="text-sm font-semibold truncate dark:text-gray-200">{quote.reference}</h4>
                  <span className="text-[10px] text-gray-400">{quote.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate">{quote.client?.companyName}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${quote.status === 'Approved' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      quote.status === 'Sent' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}>{quote.status}</span>
                </div>
              </div>
            </button>
          ))
        )}

        {/* Top Clients Section */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Clients</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {filteredClients.map(client => (
              <button
                key={client.id}
                onClick={() => handleClientClick(client)}
                className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded-xl p-1"
                aria-label={`Select client ${client.companyName}`}
              >
                <img
                  src={client.avatar}
                  alt={client.companyName}
                  className="w-12 h-12 rounded-xl object-cover bg-gray-200"
                />
                <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center">
                  {client.companyName.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DirectorySidebar;
