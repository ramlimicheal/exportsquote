import React, { useState, useMemo } from 'react';
import { DOCUMENTS } from '../constants';
import { Quote, Client, Document } from '../types';

interface DetailsPanelProps {
    className?: string;
    selectedClient: Client | null;
    selectedQuote: Partial<Quote> | null;
    onClose: () => void;
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
    className = "",
    selectedClient,
    selectedQuote,
    onClose,
    onShowToast
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

    // Calculate dynamic values from quote
    const { totalWeight, totalVolume, creditUsed } = useMemo(() => {
        const items = selectedQuote?.items || [];
        const tw = items.reduce((acc, item) => acc + (item.totalWeight || 0), 0);
        const tv = items.reduce((acc, item) => acc + (item.totalVolume || 0), 0);

        // Calculate credit usage based on quote total vs credit limit
        const creditLimit = parseInt(selectedClient?.creditLimit?.replace(/[^0-9]/g, '') || '50000');
        const quoteTotal = selectedQuote?.total || 0;
        const cu = Math.min(100, (quoteTotal / creditLimit) * 100);

        return { totalWeight: tw, totalVolume: tv, creditUsed: cu };
    }, [selectedQuote, selectedClient]);

    const handleAutoGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            onShowToast('success', 'Documents Generated', 'Invoice and Packing List created');
        }, 2000);
    };

    const handleDownload = (doc: Document) => {
        onShowToast('info', 'Downloading...', doc.name);
        // Simulate download
        setTimeout(() => {
            onShowToast('success', 'Download Complete', doc.name);
        }, 1000);
    };

    const handlePreview = (doc: Document) => {
        setPreviewDoc(doc);
        onShowToast('info', 'Opening Preview', doc.name);
    };

    const handleClosePreview = () => {
        setPreviewDoc(null);
    };

    if (!selectedClient) {
        return (
            <aside className={`w-80 bg-background-light dark:bg-background-dark border-l border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col items-center justify-center p-6 ${className}`}>
                <span className="material-icons-outlined text-4xl text-gray-300 mb-4">person_off</span>
                <p className="text-gray-400 text-center">Select a client or quote to view details</p>
            </aside>
        );
    }

    return (
        <aside className={`w-80 bg-background-light dark:bg-background-dark border-l border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col p-6 overflow-y-auto scrollbar-hide ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold">Logistics Snapshot</h3>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Close panel"
                        title="Close panel"
                    >
                        <span className="material-icons-outlined text-gray-400 text-lg">close</span>
                    </button>
                </div>
            </div>

            {/* Client Profile */}
            <div className="flex items-center gap-4 mb-6 p-3 bg-white dark:bg-surface-dark rounded-2xl shadow-sm">
                <img
                    src={selectedClient.avatar}
                    alt={selectedClient.companyName}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <h4 className="text-sm font-bold">{selectedClient.companyName}</h4>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${selectedClient.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : selectedClient.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-500'
                        }`}>
                        {selectedClient.status}
                    </span>
                </div>
            </div>

            {/* Credit Info - Dynamic */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 mb-6 border border-primary/10">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Credit Used</span>
                    <span className={`text-xs font-bold ${creditUsed > 80 ? 'text-red-500' : 'text-primary'}`}>
                        {creditUsed.toFixed(0)}%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${creditUsed > 80 ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min(creditUsed, 100)}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-gray-400">
                    Limit: {selectedClient.creditLimit || '$50,000'}
                    {selectedQuote?.total && (
                        <span className="ml-2">• Quote: ${selectedQuote.total.toLocaleString()}</span>
                    )}
                </p>
            </div>

            {/* Logistics Summary - Dynamic */}
            <div className="mb-8">
                <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Shipment Specs</h5>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-surface-dark p-3 rounded-xl text-center shadow-sm">
                        <span className="material-icons-outlined text-gray-400 text-2xl mb-1">scale</span>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Net Weight</p>
                        <p className="text-sm font-bold">{totalWeight.toFixed(0)} kg</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-3 rounded-xl text-center shadow-sm">
                        <span className="material-icons-outlined text-gray-400 text-2xl mb-1">view_in_ar</span>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Volume</p>
                        <p className="text-sm font-bold">{totalVolume.toFixed(2)} m³</p>
                    </div>
                </div>
            </div>

            {/* Generated Documents - Functional */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300">Generated Docs</h5>
                    <button
                        onClick={handleAutoGenerate}
                        disabled={isGenerating}
                        className="text-xs text-primary hover:underline disabled:opacity-50"
                    >
                        {isGenerating ? 'Generating...' : 'Auto-Generate'}
                    </button>
                </div>
                <div className="space-y-3">
                    {DOCUMENTS.map(doc => {
                        const isPdf = doc.type === 'invoice';
                        const iconColor = isPdf ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-green-500 bg-green-50 dark:bg-green-900/20';
                        const iconName = isPdf ? 'picture_as_pdf' : 'table_view';

                        return (
                            <div
                                key={doc.id}
                                onClick={() => handlePreview(doc)}
                                className="flex items-center gap-3 p-2 hover:bg-surface-light dark:hover:bg-surface-dark rounded-xl cursor-pointer group transition-colors"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && handlePreview(doc)}
                                aria-label={`Preview ${doc.name}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
                                    <span className="material-icons-outlined text-lg">{iconName}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{doc.name}</p>
                                    <p className="text-xs text-gray-400">{doc.size} • {doc.date}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-opacity p-1"
                                    aria-label={`Download ${doc.name}`}
                                    title="Download"
                                >
                                    <span className="material-icons-outlined text-sm">download</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg">
                <div className="flex items-start gap-3 mb-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <span className="material-icons-outlined text-sm">auto_graph</span>
                    </div>
                    <div>
                        <h5 className="text-sm font-bold">Pro Tip</h5>
                        <p className="text-xs text-indigo-100 opacity-90">
                            {selectedQuote?.incoterm === 'EXW'
                                ? "Switching to 'CIF' could increase conversion by 15% for this client."
                                : selectedQuote?.incoterm === 'CIF'
                                    ? "'DDP' might be preferred for buyers in this region."
                                    : "Track container utilization to optimize shipping costs."
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <span className="material-icons-outlined text-gray-400">
                                    {previewDoc.type === 'invoice' ? 'picture_as_pdf' : 'table_view'}
                                </span>
                                <h4 className="font-bold">{previewDoc.name}</h4>
                            </div>
                            <button
                                onClick={handleClosePreview}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                aria-label="Close preview"
                            >
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-8 text-center">
                            <span className="material-icons-outlined text-6xl text-gray-300 mb-4">description</span>
                            <p className="text-gray-500 mb-4">Document preview would appear here</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => handleDownload(previewDoc)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-icons-outlined text-sm">download</span>
                                    Download
                                </button>
                                <button
                                    onClick={handleClosePreview}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default DetailsPanel;
