import React, { useState } from 'react';
import { DOCUMENTS, RECENT_QUOTES, CLIENTS } from '../constants';

interface DocumentsPageProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

interface Document {
    id: string;
    name: string;
    type: 'invoice' | 'packing_list' | 'bill_of_lading' | 'certificate' | 'customs' | 'insurance';
    status: 'draft' | 'pending' | 'approved' | 'signed';
    quoteRef?: string;
    client?: string;
    createdAt: string;
    size: string;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ onShowToast }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'templates' | 'generated'>('all');
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [showGenerator, setShowGenerator] = useState(false);
    const [generatorStep, setGeneratorStep] = useState(1);
    const [generatorData, setGeneratorData] = useState({
        docType: 'invoice',
        quoteRef: '',
        includeItems: true,
        includeTerms: true,
        digitalSignature: false
    });

    // Mock documents data
    const documents: Document[] = [
        { id: 'd1', name: 'Commercial Invoice - QT-2024-001', type: 'invoice', status: 'signed', quoteRef: 'QT-2024-001', client: 'TechCorp Global', createdAt: '2024-01-15', size: '245 KB' },
        { id: 'd2', name: 'Packing List - QT-2024-001', type: 'packing_list', status: 'approved', quoteRef: 'QT-2024-001', client: 'TechCorp Global', createdAt: '2024-01-15', size: '128 KB' },
        { id: 'd3', name: 'Bill of Lading - SH-001', type: 'bill_of_lading', status: 'pending', quoteRef: 'QT-2024-001', client: 'TechCorp Global', createdAt: '2024-01-16', size: '312 KB' },
        { id: 'd4', name: 'Certificate of Origin', type: 'certificate', status: 'draft', quoteRef: 'QT-2024-002', client: 'BuildRight Ltd', createdAt: '2024-01-18', size: '89 KB' },
        { id: 'd5', name: 'Customs Declaration', type: 'customs', status: 'approved', quoteRef: 'QT-2024-003', client: 'GreenEnergy Solutions', createdAt: '2024-01-19', size: '156 KB' },
        { id: 'd6', name: 'Marine Insurance Certificate', type: 'insurance', status: 'signed', quoteRef: 'QT-2024-001', client: 'TechCorp Global', createdAt: '2024-01-15', size: '198 KB' },
    ];

    // Document templates
    const templates = [
        { id: 't1', name: 'Commercial Invoice', icon: 'receipt_long', description: 'Standard export invoice with itemized products', fields: 12 },
        { id: 't2', name: 'Packing List', icon: 'inventory', description: 'Detailed list of package contents and weights', fields: 8 },
        { id: 't3', name: 'Bill of Lading', icon: 'sailing', description: 'Shipping document for ocean freight', fields: 15 },
        { id: 't4', name: 'Certificate of Origin', icon: 'verified', description: 'Certifies country of manufacture', fields: 6 },
        { id: 't5', name: 'Customs Declaration', icon: 'gavel', description: 'Import/export customs documentation', fields: 18 },
        { id: 't6', name: 'Insurance Certificate', icon: 'security', description: 'Marine/cargo insurance document', fields: 10 },
    ];

    const statusColors = {
        draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
        approved: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        signed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    };

    const typeIcons: Record<string, string> = {
        invoice: 'receipt_long',
        packing_list: 'inventory',
        bill_of_lading: 'sailing',
        certificate: 'verified',
        customs: 'gavel',
        insurance: 'security'
    };

    const handleGenerate = () => {
        if (generatorStep < 3) {
            setGeneratorStep(generatorStep + 1);
        } else {
            onShowToast('success', 'Document Generated', 'Your document is ready for review');
            setShowGenerator(false);
            setGeneratorStep(1);
        }
    };

    const complianceChecks = [
        { id: 'c1', name: 'HS Code Validation', status: 'passed', description: 'All product codes match official registry' },
        { id: 'c2', name: 'Destination Country Requirements', status: 'passed', description: 'Documentation meets import requirements' },
        { id: 'c3', name: 'Incoterm Consistency', status: 'passed', description: 'Terms match across all documents' },
        { id: 'c4', name: 'Value Declaration', status: 'warning', description: 'Consider adding insurance for high-value items' },
        { id: 'c5', name: 'Digital Signature', status: 'pending', description: 'Awaiting authorized signature' },
    ];

    return (
        <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Documents</h1>
                    <p className="text-sm text-gray-500">Generate, manage, and sign export documents</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowGenerator(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-icons-outlined text-sm">auto_awesome</span>
                        Generate Document
                    </button>
                    <button
                        onClick={() => onShowToast('info', 'Batch Export', 'Preparing documents for export...')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <span className="material-icons-outlined text-sm">file_download</span>
                        Batch Export
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="px-8 pt-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex gap-6">
                    {[
                        { id: 'all', label: 'All Documents', count: documents.length },
                        { id: 'templates', label: 'Templates', count: templates.length },
                        { id: 'generated', label: 'Recently Generated', count: 4 },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">{tab.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'all' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Documents List */}
                        <div className="lg:col-span-2 space-y-4">
                            {documents.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => setSelectedDoc(doc)}
                                    className={`w-full text-left p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md transition-all ${selectedDoc?.id === doc.id ? 'ring-2 ring-primary' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <span className="material-icons-outlined text-primary">{typeIcons[doc.type]}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold truncate">{doc.name}</p>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[doc.status]}`}>
                                                    {doc.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">{doc.client} • {doc.quoteRef}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-icons-outlined text-xs">calendar_today</span>
                                                    {doc.createdAt}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-icons-outlined text-xs">description</span>
                                                    {doc.size}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onShowToast('info', 'Download', 'Downloading ' + doc.name); }}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            >
                                                <span className="material-icons-outlined text-sm text-gray-400">download</span>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onShowToast('info', 'Preview', 'Opening preview...'); }}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            >
                                                <span className="material-icons-outlined text-sm text-gray-400">visibility</span>
                                            </button>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Compliance Checker */}
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-icons-outlined text-primary">verified_user</span>
                                    <h3 className="font-bold">Compliance Checker</h3>
                                </div>
                                <div className="space-y-3">
                                    {complianceChecks.map(check => (
                                        <div key={check.id} className="flex items-start gap-3">
                                            <span className={`material-icons-outlined text-sm mt-0.5 ${
                                                check.status === 'passed' ? 'text-green-500' :
                                                check.status === 'warning' ? 'text-yellow-500' : 'text-gray-400'
                                            }`}>
                                                {check.status === 'passed' ? 'check_circle' :
                                                check.status === 'warning' ? 'warning' : 'pending'}
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{check.name}</p>
                                                <p className="text-xs text-gray-500">{check.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => onShowToast('success', 'Compliance Check', 'All checks passed!')}
                                    className="w-full mt-4 py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/5"
                                >
                                    Run Full Check
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-icons-outlined">auto_awesome</span>
                                    <h3 className="font-bold">AI Document Assistant</h3>
                                </div>
                                <p className="text-sm opacity-80 mb-4">
                                    Let AI help you generate and review export documents automatically.
                                </p>
                                <button
                                    onClick={() => setShowGenerator(true)}
                                    className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Start AI Generator
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map(template => (
                            <div key={template.id} className="bg-white dark:bg-surface-dark rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <span className="material-icons-outlined text-primary">{template.icon}</span>
                                </div>
                                <h3 className="font-bold mb-1">{template.name}</h3>
                                <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{template.fields} fields</span>
                                    <button
                                        onClick={() => { setGeneratorData(prev => ({ ...prev, docType: template.id })); setShowGenerator(true); }}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Use Template
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'generated' && (
                    <div className="max-w-2xl">
                        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold">Recently Generated Documents</h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {documents.slice(0, 4).map(doc => (
                                    <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons-outlined text-gray-400">{typeIcons[doc.type]}</span>
                                            <div>
                                                <p className="font-medium text-sm">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{doc.createdAt}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onShowToast('info', 'Download', 'Downloading...')}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                <span className="material-icons-outlined text-sm text-gray-400">download</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Document Generator Modal */}
            {showGenerator && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <span className="material-icons-outlined text-primary">auto_awesome</span>
                                <h3 className="font-bold">AI Document Generator</h3>
                            </div>
                            <button onClick={() => { setShowGenerator(false); setGeneratorStep(1); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>

                        {/* Progress Steps */}
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between">
                                {['Select Type', 'Configure', 'Generate'].map((step, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                            i + 1 <= generatorStep ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}>
                                            {i + 1 <= generatorStep - 1 ? '✓' : i + 1}
                                        </div>
                                        <span className={`ml-2 text-sm ${i + 1 <= generatorStep ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>
                                            {step}
                                        </span>
                                        {i < 2 && <div className={`w-8 h-0.5 mx-2 ${i + 1 < generatorStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            {generatorStep === 1 && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {templates.slice(0, 4).map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setGeneratorData(prev => ({ ...prev, docType: t.id }))}
                                                className={`p-3 rounded-xl border text-left transition-all ${
                                                    generatorData.docType === t.id ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                                }`}
                                            >
                                                <span className="material-icons-outlined text-primary mb-1">{t.icon}</span>
                                                <p className="text-sm font-medium">{t.name}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {generatorStep === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Quote Reference</label>
                                        <select
                                            value={generatorData.quoteRef}
                                            onChange={(e) => setGeneratorData(prev => ({ ...prev, quoteRef: e.target.value }))}
                                            className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                        >
                                            <option value="">Select a quote...</option>
                                            {RECENT_QUOTES.map(q => (
                                                <option key={q.id} value={q.reference}>{q.reference} - {q.client?.companyName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={generatorData.includeItems}
                                                onChange={(e) => setGeneratorData(prev => ({ ...prev, includeItems: e.target.checked }))}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">Include line items</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={generatorData.includeTerms}
                                                onChange={(e) => setGeneratorData(prev => ({ ...prev, includeTerms: e.target.checked }))}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">Include terms & conditions</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={generatorData.digitalSignature}
                                                onChange={(e) => setGeneratorData(prev => ({ ...prev, digitalSignature: e.target.checked }))}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">Add digital signature field</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {generatorStep === 3 && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                        <span className="material-icons-outlined text-green-600 text-3xl">check</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Document Ready!</h3>
                                    <p className="text-sm text-gray-500 mb-4">Your document has been generated and is ready for review.</p>
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => onShowToast('info', 'Preview', 'Opening preview...')}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => onShowToast('success', 'Downloaded', 'Document saved to downloads')}
                                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                                        >
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {generatorStep < 3 && (
                            <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setGeneratorStep(Math.max(1, generatorStep - 1))}
                                    className={`px-4 py-2 text-sm ${generatorStep === 1 ? 'invisible' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                                >
                                    {generatorStep === 2 ? 'Generate' : 'Next'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default DocumentsPage;
