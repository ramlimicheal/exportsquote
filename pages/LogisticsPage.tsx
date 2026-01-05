import React, { useState, useMemo } from 'react';
import { SHIPMENTS, INCOTERM_INFO } from '../constants';
import { Shipment, ShipmentStatus } from '../types';
import { CONTAINER_20FT_CBM } from '../utils';

interface LogisticsPageProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

const LogisticsPage: React.FC<LogisticsPageProps> = ({ onShowToast }) => {
    const [shipments] = useState<Shipment[]>(SHIPMENTS);
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
    const [selectedIncoterm, setSelectedIncoterm] = useState<string | null>(null);
    const [calculatorWeight, setCalculatorWeight] = useState(1000);
    const [calculatorVolume, setCalculatorVolume] = useState(10);

    const filteredShipments = useMemo(() => {
        if (statusFilter === 'all') return shipments;
        return shipments.filter(s => s.status === statusFilter);
    }, [shipments, statusFilter]);

    const statusColors: Record<ShipmentStatus, { bg: string; text: string; label: string }> = {
        pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', label: 'Pending' },
        in_transit: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'In Transit' },
        customs: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', label: 'At Customs' },
        delivered: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Delivered' }
    };

    const containerCapacity = {
        '20ft': { cbm: 33.2, kg: 21770 },
        '40ft': { cbm: 67.7, kg: 26780 },
        '40ft_hq': { cbm: 76.3, kg: 26460 }
    };

    const getRecommendedContainer = (weight: number, volume: number) => {
        // Check which container fits
        if (volume <= containerCapacity['20ft'].cbm && weight <= containerCapacity['20ft'].kg) {
            return { type: '20ft', utilization: (volume / containerCapacity['20ft'].cbm) * 100 };
        }
        if (volume <= containerCapacity['40ft'].cbm && weight <= containerCapacity['40ft'].kg) {
            return { type: '40ft', utilization: (volume / containerCapacity['40ft'].cbm) * 100 };
        }
        if (volume <= containerCapacity['40ft_hq'].cbm && weight <= containerCapacity['40ft_hq'].kg) {
            return { type: '40ft HQ', utilization: (volume / containerCapacity['40ft_hq'].cbm) * 100 };
        }
        return { type: 'Multiple containers', utilization: 100 };
    };

    const recommendation = getRecommendedContainer(calculatorWeight, calculatorVolume);

    const handleTrack = (shipment: Shipment) => {
        if (shipment.trackingNumber) {
            onShowToast('info', 'Tracking', `Tracking ${shipment.trackingNumber} in new window`);
            // In production, this would open the shipping line's tracking page
        } else {
            onShowToast('warning', 'No Tracking', 'Tracking number not yet assigned');
        }
    };

    return (
        <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Logistics</h1>
                    <p className="text-sm text-gray-500">Track shipments and calculate container requirements</p>
                </div>
                <div className="flex items-center gap-2">
                    {(['all', 'pending', 'in_transit', 'customs', 'delivered'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === status
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'all' ? 'All' : statusColors[status as ShipmentStatus]?.label || status}
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Shipments Table - 2 columns */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-bold">Active Shipments</h3>
                                <span className="text-sm text-gray-500">{filteredShipments.length} shipments</span>
                            </div>

                            {filteredShipments.length === 0 ? (
                                <div className="py-12 text-center text-gray-400">
                                    <span className="material-icons-outlined text-4xl">local_shipping</span>
                                    <p className="mt-2">No shipments found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredShipments.map(shipment => (
                                        <div key={shipment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={shipment.client.avatar}
                                                        alt={shipment.client.companyName}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-semibold">{shipment.quoteRef}</p>
                                                        <p className="text-sm text-gray-500">{shipment.client.companyName}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[shipment.status].bg} ${statusColors[shipment.status].text}`}>
                                                    {statusColors[shipment.status].label}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <span className="material-icons-outlined text-sm">flight_takeoff</span>
                                                <span>{shipment.origin}</span>
                                                <span className="material-icons-outlined text-primary text-sm">arrow_forward</span>
                                                <span className="material-icons-outlined text-sm">flight_land</span>
                                                <span>{shipment.destination}</span>
                                            </div>

                                            <div className="grid grid-cols-4 gap-4 text-xs">
                                                <div>
                                                    <span className="text-gray-400 block mb-1">Ship Date</span>
                                                    <span className="font-medium">{shipment.shipDate}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block mb-1">ETA</span>
                                                    <span className="font-medium">{shipment.eta}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block mb-1">Container</span>
                                                    <span className="font-medium">{shipment.container.replace('_', ' ').toUpperCase()}</span>
                                                </div>
                                                <div className="text-right">
                                                    <button
                                                        onClick={() => handleTrack(shipment)}
                                                        className="text-primary hover:underline flex items-center gap-1 ml-auto"
                                                    >
                                                        <span className="material-icons-outlined text-sm">track_changes</span>
                                                        Track
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Calculator & Incoterms */}
                    <div className="space-y-6">
                        {/* Container Calculator */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm p-5">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <span className="material-icons-outlined text-primary">calculate</span>
                                Container Calculator
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Total Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={calculatorWeight}
                                        onChange={(e) => setCalculatorWeight(parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Total Volume (m³)
                                    </label>
                                    <input
                                        type="number"
                                        value={calculatorVolume}
                                        onChange={(e) => setCalculatorVolume(parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                    />
                                </div>

                                <div className="bg-primary/10 rounded-xl p-4 text-center">
                                    <p className="text-sm text-gray-500 mb-1">Recommended Container</p>
                                    <p className="text-2xl font-bold text-primary">{recommendation.type}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {recommendation.utilization.toFixed(1)}% utilization
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                                        <p className="font-bold">20ft</p>
                                        <p className="text-gray-500">33.2 m³</p>
                                        <p className="text-gray-500">21.7 ton</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                                        <p className="font-bold">40ft</p>
                                        <p className="text-gray-500">67.7 m³</p>
                                        <p className="text-gray-500">26.7 ton</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                                        <p className="font-bold">40ft HQ</p>
                                        <p className="text-gray-500">76.3 m³</p>
                                        <p className="text-gray-500">26.4 ton</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Incoterms Reference */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm p-5">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <span className="material-icons-outlined text-primary">menu_book</span>
                                Incoterms Guide
                            </h3>

                            <div className="space-y-2">
                                {Object.entries(INCOTERM_INFO).map(([code, info]) => (
                                    <button
                                        key={code}
                                        onClick={() => setSelectedIncoterm(selectedIncoterm === code ? null : code)}
                                        className={`w-full text-left p-3 rounded-xl transition-colors ${selectedIncoterm === code
                                                ? 'bg-primary/10 border-2 border-primary'
                                                : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-primary">{code}</span>
                                            <span className="text-sm text-gray-500">{info.name}</span>
                                            <span className="material-icons-outlined text-sm">
                                                {selectedIncoterm === code ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </div>

                                        {selectedIncoterm === code && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
                                                <p className="text-gray-600 dark:text-gray-400 mb-2">{info.description}</p>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                                        <p className="text-xs font-semibold text-green-600 dark:text-green-400">Seller</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{info.seller}</p>
                                                    </div>
                                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Buyer</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{info.buyer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LogisticsPage;
