import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_QUOTE, PRODUCTS } from '../constants';
import { QuoteItem, Product, Incoterm, Quote, Client } from '../types';
import { calculateItemMetrics, calculateShipping, CONTAINER_20FT_CBM, getMarginColor } from '../utils';

interface ChatInterfaceProps {
    selectedQuote: Partial<Quote> | null;
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
    onSelectClient: (client: Client) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedQuote: propQuote, onShowToast, onSelectClient }) => {
    const [quote, setQuote] = useState<Quote>(propQuote as Quote || INITIAL_QUOTE);
    const [showProductPicker, setShowProductPicker] = useState(false);
    const [isSimulatingAI, setIsSimulatingAI] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [isGeneratingShare, setIsGeneratingShare] = useState(false);

    // Sync with prop changes
    useEffect(() => {
        if (propQuote && propQuote.id !== quote.id) {
            setQuote({ ...INITIAL_QUOTE, ...propQuote } as Quote);
        }
    }, [propQuote, quote.id]);

    // Recalculate everything when items or incoterm changes
    useEffect(() => {
        const itemMetrics = quote.items.map(item => ({
            ...item,
            ...calculateItemMetrics(item.product, item.quantity)
        }));

        const subtotal = itemMetrics.reduce((acc, item) => acc + item.total, 0);
        const totalCost = itemMetrics.reduce((acc, item) => acc + (item.product.costPrice * item.quantity), 0);
        const totalWeight = itemMetrics.reduce((acc, item) => acc + item.totalWeight, 0);
        const totalVolume = itemMetrics.reduce((acc, item) => acc + item.totalVolume, 0);

        // Incoterm Logic
        const shippingCost = calculateShipping(totalWeight, totalVolume, quote.incoterm);
        const insuranceCost = quote.incoterm === 'CIF' || quote.incoterm === 'DDP' ? subtotal * 0.005 : 0;

        const tax = subtotal * 0.18; // 18% GST
        const total = subtotal + tax + shippingCost + insuranceCost;

        // Margin Shield Logic
        const profit = subtotal - totalCost;
        const margin = subtotal > 0 ? (profit / subtotal) * 100 : 0;

        // Container Tetris Logic
        const containerUtilization = (totalVolume / CONTAINER_20FT_CBM) * 100;

        setQuote(prev => ({
            ...prev,
            subtotal,
            shippingCost,
            insuranceCost,
            tax,
            total,
            margin,
            containerUtilization,
            items: itemMetrics as QuoteItem[]
        }));
    }, [quote.items, quote.incoterm]);

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        if (!productSearch) return PRODUCTS;
        const query = productSearch.toLowerCase();
        return PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query) ||
            p.hsCode.includes(query)
        );
    }, [productSearch]);

    const addItem = (product: Product) => {
        // Check if product already exists
        const existingItem = quote.items.find(item => item.product.id === product.id);
        if (existingItem) {
            updateQuantity(existingItem.id, 1);
            onShowToast('info', 'Quantity Updated', `${product.name} quantity increased`);
        } else {
            const newItem: QuoteItem = {
                id: `qi-${Date.now()}`,
                product,
                quantity: 1,
                total: product.unitPrice,
                totalWeight: product.weight,
                totalVolume: 0
            };
            setQuote(prev => ({ ...prev, items: [...prev.items, newItem] }));
            onShowToast('success', 'Product Added', product.name);
        }
        setShowProductPicker(false);
        setProductSearch('');
    };

    const updateQuantity = (id: string, delta: number) => {
        setQuote(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return {
                        ...item,
                        quantity: newQty,
                        total: newQty * item.product.unitPrice
                    };
                }
                return item;
            })
        }));
    };

    const removeItem = (id: string) => {
        const item = quote.items.find(i => i.id === id);
        setQuote(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
        if (item) {
            onShowToast('warning', 'Product Removed', item.product.name);
        }
    };

    const simulateAIAssist = () => {
        setIsSimulatingAI(true);
        setTimeout(() => {
            setIsSimulatingAI(false);
            onShowToast('success', 'AI Suggestion', "HS Code for 'Valve' is 8481.80 based on recent export norms.");
        }, 1500);
    };

    const handleWhatsAppShare = () => {
        setIsGeneratingShare(true);

        // Generate quote summary
        const itemList = quote.items.map(item =>
            `• ${item.product.name} x${item.quantity} = $${item.total.toLocaleString()}`
        ).join('\n');

        const message = `*${quote.reference}*\n\n` +
            `Client: ${quote.client.companyName}\n` +
            `Incoterm: ${quote.incoterm}\n\n` +
            `*Items:*\n${itemList}\n\n` +
            `Subtotal: $${quote.subtotal.toLocaleString()}\n` +
            `Freight: $${quote.shippingCost.toLocaleString()}\n` +
            `Tax (18%): $${quote.tax.toLocaleString()}\n` +
            `───────────────\n` +
            `*Total: $${quote.total.toLocaleString()}*\n\n` +
            `Margin: ${quote.margin.toFixed(1)}%\n` +
            `Container: ${quote.containerUtilization.toFixed(1)}% utilized`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

        setTimeout(() => {
            setIsGeneratingShare(false);
            window.open(whatsappUrl, '_blank');
            onShowToast('success', 'Quote Shared', 'Opening WhatsApp...');
        }, 500);
    };

    const handleIncotermChange = (newIncoterm: Incoterm) => {
        setQuote(prev => ({ ...prev, incoterm: newIncoterm }));
        onShowToast('info', 'Incoterm Updated', `Changed to ${newIncoterm}`);
    };

    // Calculate totals for display
    const totalWeight = quote.items.reduce((acc, item) => acc + item.totalWeight, 0);
    const totalVolume = quote.items.reduce((acc, item) => acc + item.totalVolume, 0);

    return (
        <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden relative">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 flex-shrink-0">
                <div className="relative w-full md:w-1/3 flex gap-2">
                    <div className="relative flex-1">
                        <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                        <input
                            type="text"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-surface-light dark:bg-surface-dark rounded-full border-none text-sm focus:ring-2 focus:ring-primary/50 placeholder-gray-400"
                            placeholder="Search products..."
                            aria-label="Search products"
                            onFocus={() => setShowProductPicker(true)}
                        />
                        {productSearch && (
                            <button
                                onClick={() => setProductSearch('')}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <span className="material-icons-outlined text-sm">close</span>
                            </button>
                        )}
                    </div>
                    <button
                        onClick={simulateAIAssist}
                        disabled={isSimulatingAI}
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-xs font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                        aria-label="Get AI assistance"
                    >
                        {isSimulatingAI ? (
                            <span className="animate-spin material-icons-outlined text-xs">refresh</span>
                        ) : (
                            <span className="material-icons-outlined text-xs">auto_awesome</span>
                        )}
                        AI Assist
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-500 uppercase font-bold mr-1">Incoterm:</span>
                        <select
                            value={quote.incoterm}
                            onChange={(e) => handleIncotermChange(e.target.value as Incoterm)}
                            className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 p-0 cursor-pointer"
                            aria-label="Select incoterm"
                        >
                            <option value="EXW">EXW (Ex Works)</option>
                            <option value="FOB">FOB (Free on Board)</option>
                            <option value="CIF">CIF (Cost Ins. Freight)</option>
                            <option value="DDP">DDP (Delivered Duty Paid)</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="flex-1 px-8 pb-6 flex flex-col min-h-0">
                {/* Main Workspace */}
                <div className="flex-1 bg-[#EBE7DF] dark:bg-[#1E1E24] rounded-3xl shadow-sm flex flex-col relative overflow-hidden">

                    {/* Header with Margin Shield */}
                    <div className="h-16 flex items-center justify-between px-6 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white">
                                <span className="material-icons-outlined text-sm">assignment</span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-800 dark:text-gray-200">{quote.reference}</h2>
                                <p className="text-xs text-gray-500">Created {quote.date}</p>
                            </div>
                        </div>

                        {/* The Margin Shield Visualization */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getMarginColor(quote.margin)}`}>
                            <span className="material-icons-outlined text-sm">shield</span>
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-[10px] uppercase font-bold opacity-70">Net Margin</span>
                                <span className="text-sm font-bold">{quote.margin.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">

                        {/* Container Tetris Bar */}
                        <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-gray-500">inventory</span>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Container Utilization (20ft)</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-gray-500">{quote.containerUtilization.toFixed(1)}% Full</span>
                                    <span className="text-[10px] text-gray-400 block">{totalWeight.toFixed(0)} kg / {totalVolume.toFixed(2)} m³</span>
                                </div>
                            </div>
                            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                                <div
                                    className={`h-full transition-all duration-500 ease-out ${quote.containerUtilization > 100 ? 'bg-red-500' : 'bg-primary'}`}
                                    style={{ width: `${Math.min(quote.containerUtilization, 100)}%` }}
                                ></div>
                                {/* Marker lines for visual reference */}
                                <div className="absolute top-0 bottom-0 left-[25%] w-px bg-white/50"></div>
                                <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/50"></div>
                                <div className="absolute top-0 bottom-0 left-[75%] w-px bg-white/50"></div>
                            </div>
                            {quote.containerUtilization > 100 && (
                                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                    <span className="material-icons-outlined text-xs">warning</span>
                                    Capacity exceeded. Consider upgrading to 40ft HQ or FTL.
                                </p>
                            )}
                        </div>

                        {/* Empty State */}
                        {quote.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <span className="material-icons-outlined text-6xl mb-4">inventory_2</span>
                                <h3 className="text-lg font-semibold mb-2">No Products Added</h3>
                                <p className="text-sm mb-4">Start building your quote by adding products</p>
                                <button
                                    onClick={() => setShowProductPicker(true)}
                                    className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Add First Product
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Line Items Header */}
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <div className="col-span-5">Product & HS Code</div>
                                    <div className="col-span-2 text-right">Unit Price</div>
                                    <div className="col-span-3 text-center">Qty / Vol</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                {/* Line Items List */}
                                <div className="space-y-3 mb-6">
                                    {quote.items.map((item) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                                            <div className="col-span-5 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                                    <span className="material-icons-outlined">{item.product.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{item.product.name}</p>
                                                    <div className="flex gap-2 mt-0.5">
                                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">HS {item.product.hsCode}</span>
                                                        <span className="text-[10px] text-gray-400">{item.product.dimensions.length}x{item.product.dimensions.width}x{item.product.dimensions.height}cm</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-right font-medium text-sm text-gray-600 dark:text-gray-300">
                                                ${item.product.unitPrice}
                                            </div>
                                            <div className="col-span-3 flex flex-col items-center gap-1">
                                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="text-gray-500 hover:text-primary w-5"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        className="w-10 bg-transparent border-none text-center text-sm p-0 focus:ring-0"
                                                        value={item.quantity}
                                                        readOnly
                                                        aria-label="Quantity"
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="text-gray-500 hover:text-primary w-5"
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="text-[10px] text-gray-400">{item.totalVolume.toFixed(2)} m³</span>
                                            </div>
                                            <div className="col-span-2 flex items-center justify-end gap-2">
                                                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                                    ${item.total.toLocaleString()}
                                                </span>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                                    aria-label={`Remove ${item.product.name}`}
                                                    title="Remove item"
                                                >
                                                    <span className="material-icons-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Add Product Button */}
                        <button
                            onClick={() => setShowProductPicker(!showProductPicker)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 font-medium"
                            aria-expanded={showProductPicker}
                        >
                            <span className="material-icons-outlined">add_circle_outline</span>
                            Add Product Line
                        </button>

                        {/* Product Picker */}
                        {showProductPicker && (
                            <div className="mt-3 bg-white dark:bg-surface-dark p-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Catalog</p>
                                    <button
                                        onClick={() => { setShowProductPicker(false); setProductSearch(''); }}
                                        className="text-gray-400 hover:text-gray-600"
                                        aria-label="Close product picker"
                                    >
                                        <span className="material-icons-outlined text-sm">close</span>
                                    </button>
                                </div>

                                {filteredProducts.length === 0 ? (
                                    <div className="py-8 text-center text-gray-400">
                                        <span className="material-icons-outlined text-3xl mb-2">search_off</span>
                                        <p className="text-sm">No products found for "{productSearch}"</p>
                                    </div>
                                ) : (
                                    filteredProducts.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => addItem(p)}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 text-left"
                                        >
                                            <span className="material-icons-outlined text-gray-400">{p.icon}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{p.name}</p>
                                                <div className="flex justify-between">
                                                    <p className="text-xs text-gray-500">${p.unitPrice}/{p.unit}</p>
                                                    <p className="text-xs text-green-600">Margin: {(((p.unitPrice - p.costPrice) / p.unitPrice) * 100).toFixed(0)}%</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Financial Summary */}
                        {quote.items.length > 0 && (
                            <div className="flex justify-end mt-6">
                                <div className="w-80 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal (Ex-Works)</span>
                                            <span>${quote.subtotal.toLocaleString()}</span>
                                        </div>

                                        {/* Dynamic Logistics Line Items */}
                                        <div className={`flex justify-between ${quote.incoterm === 'EXW' ? 'text-gray-300 line-through' : 'text-blue-600'}`}>
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-xs">local_shipping</span>
                                                Freight ({quote.incoterm})
                                            </span>
                                            <span>${quote.shippingCost.toLocaleString()}</span>
                                        </div>

                                        {(quote.incoterm === 'CIF' || quote.incoterm === 'DDP') && (
                                            <div className="flex justify-between text-blue-600">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-icons-outlined text-xs">security</span>
                                                    Insurance
                                                </span>
                                                <span>${quote.insuranceCost.toLocaleString()}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between text-gray-500">
                                            <span>Est. Tax (18%)</span>
                                            <span>${quote.tax.toLocaleString()}</span>
                                        </div>

                                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg text-gray-800 dark:text-white">Total</span>
                                            <div className="text-right">
                                                <span className="block font-bold text-lg text-gray-800 dark:text-white">${quote.total.toLocaleString()}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">{quote.incoterm} Destination Port</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="h-20"></div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center mt-4 hidden md:flex">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="material-icons-outlined text-green-500 text-base">verified</span>
                            <span>Valid HS Codes</span>
                        </div>
                        {quote.margin < 15 && quote.items.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-yellow-600">
                                <span className="material-icons-outlined text-base">warning</span>
                                <span>Low Margin Warning</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleWhatsAppShare}
                        disabled={isGeneratingShare || quote.items.length === 0}
                        className="bg-gray-800 dark:bg-primary text-white px-8 py-3 rounded-full text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        aria-label="Share quote on WhatsApp"
                    >
                        {isGeneratingShare ? (
                            <span className="animate-spin material-icons-outlined">refresh</span>
                        ) : (
                            <span className="material-icons-outlined">share</span>
                        )}
                        Share on WhatsApp
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ChatInterface;
