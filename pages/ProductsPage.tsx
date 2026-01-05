import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface ProductsPageProps {
    onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onShowToast }) => {
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        unitPrice: 0,
        costPrice: 0,
        unit: 'kg' as Product['unit'],
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        hsCode: '',
        icon: 'inventory_2'
    });

    // Filter products by search
    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        const q = searchQuery.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.hsCode.includes(q)
        );
    }, [products, searchQuery]);

    const calculateMargin = (price: number, cost: number) => {
        if (price <= 0) return 0;
        return ((price - cost) / price) * 100;
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '', sku: '', unitPrice: 0, costPrice: 0, unit: 'kg',
            weight: 0, length: 0, width: 0, height: 0, hsCode: '', icon: 'inventory_2'
        });
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            sku: product.sku,
            unitPrice: product.unitPrice,
            costPrice: product.costPrice,
            unit: product.unit,
            weight: product.weight,
            length: product.dimensions.length,
            width: product.dimensions.width,
            height: product.dimensions.height,
            hsCode: product.hsCode,
            icon: product.icon
        });
        setShowModal(true);
    };

    const handleSave = () => {
        const newProduct: Product = {
            id: editingProduct?.id || `p-${Date.now()}`,
            name: formData.name,
            sku: formData.sku,
            unitPrice: formData.unitPrice,
            costPrice: formData.costPrice,
            unit: formData.unit,
            weight: formData.weight,
            dimensions: { length: formData.length, width: formData.width, height: formData.height },
            hsCode: formData.hsCode,
            icon: formData.icon
        };

        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
            onShowToast('success', 'Product Updated', newProduct.name);
        } else {
            setProducts(prev => [...prev, newProduct]);
            onShowToast('success', 'Product Added', newProduct.name);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        const product = products.find(p => p.id === id);
        setProducts(prev => prev.filter(p => p.id !== id));
        setDeleteConfirm(null);
        if (product) onShowToast('warning', 'Product Deleted', product.name);
    };

    const iconOptions = ['inventory_2', 'restaurant', 'settings_suggest', 'local_shipping', 'checkroom', 'devices', 'agriculture', 'build'];

    return (
        <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
                    <p className="text-sm text-gray-500">Manage your product catalog</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-card-dark shadow-sm' : ''}`}
                            aria-label="Grid view"
                        >
                            <span className="material-icons-outlined text-sm">grid_view</span>
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded ${viewMode === 'table' ? 'bg-white dark:bg-card-dark shadow-sm' : ''}`}
                            aria-label="Table view"
                        >
                            <span className="material-icons-outlined text-sm">view_list</span>
                        </button>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-icons-outlined text-sm">add</span>
                        Add Product
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="px-8 py-4">
                <div className="relative max-w-md">
                    <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface-light dark:bg-surface-dark rounded-xl border-none text-sm focus:ring-2 focus:ring-primary/50"
                        placeholder="Search by name, SKU, or HS code..."
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 pb-8 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <span className="material-icons-outlined text-6xl mb-4">inventory_2</span>
                        <p className="text-lg font-medium">No products found</p>
                        <button onClick={openAddModal} className="mt-4 text-primary hover:underline">
                            Add your first product
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span className="material-icons-outlined text-primary">{product.icon}</span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                            title="Edit"
                                        >
                                            <span className="material-icons-outlined text-sm text-gray-400">edit</span>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(product.id)}
                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            title="Delete"
                                        >
                                            <span className="material-icons-outlined text-sm text-red-400">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{product.name}</h3>
                                <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                                        ${product.unitPrice}
                                        <span className="text-xs font-normal text-gray-400">/{product.unit}</span>
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${calculateMargin(product.unitPrice, product.costPrice) >= 20
                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                            : calculateMargin(product.unitPrice, product.costPrice) >= 10
                                                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {calculateMargin(product.unitPrice, product.costPrice).toFixed(0)}% margin
                                    </span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs text-gray-500">
                                    <span>HS: {product.hsCode}</span>
                                    <span>{product.weight}kg/unit</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Cost</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Margin</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">HS Code</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <span className="material-icons-outlined text-primary text-sm">{product.icon}</span>
                                                </div>
                                                <span className="font-medium">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{product.sku}</td>
                                        <td className="px-4 py-3 text-right font-semibold">${product.unitPrice}</td>
                                        <td className="px-4 py-3 text-right text-gray-500">${product.costPrice}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`font-semibold ${calculateMargin(product.unitPrice, product.costPrice) >= 20 ? 'text-green-600' :
                                                    calculateMargin(product.unitPrice, product.costPrice) >= 10 ? 'text-yellow-600' : 'text-red-500'
                                                }`}>
                                                {calculateMargin(product.unitPrice, product.costPrice).toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{product.hsCode}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => openEditModal(product)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                                <span className="material-icons-outlined text-sm text-gray-400">edit</span>
                                            </button>
                                            <button onClick={() => setDeleteConfirm(product.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded ml-1">
                                                <span className="material-icons-outlined text-sm text-red-400">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-lg">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Premium Cotton Yarn"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU *</label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                        placeholder="TX-CY-001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HS Code *</label>
                                    <input
                                        type="text"
                                        value={formData.hsCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, hsCode: e.target.value }))}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                        placeholder="5205.11"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Price ($)</label>
                                    <input
                                        type="number"
                                        value={formData.unitPrice}
                                        onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Price ($)</label>
                                    <input
                                        type="number"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                                    <select
                                        value={formData.unit}
                                        onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value as Product['unit'] }))}
                                        className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="ton">ton</option>
                                        <option value="unit">unit</option>
                                        <option value="box">box</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight per Unit (kg)</label>
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dimensions (cm)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="number"
                                        value={formData.length}
                                        onChange={(e) => setFormData(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
                                        className="px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                        placeholder="Length"
                                    />
                                    <input
                                        type="number"
                                        value={formData.width}
                                        onChange={(e) => setFormData(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                                        className="px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                        placeholder="Width"
                                    />
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => setFormData(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                                        className="px-3 py-2 bg-surface-light dark:bg-gray-800 rounded-lg border-none"
                                        placeholder="Height"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                                <div className="flex gap-2 flex-wrap">
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.icon === icon ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                                }`}
                                        >
                                            <span className="material-icons-outlined text-sm">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {formData.unitPrice > 0 && formData.costPrice > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                                    <span className="text-sm text-gray-500">Calculated Margin: </span>
                                    <span className={`font-bold ${calculateMargin(formData.unitPrice, formData.costPrice) >= 20 ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {calculateMargin(formData.unitPrice, formData.costPrice).toFixed(1)}%
                                    </span>
                                </div>
                            )}
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
                                disabled={!formData.name || !formData.sku}
                                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                                {editingProduct ? 'Save Changes' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-sm shadow-2xl">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                                <span className="material-icons-outlined text-red-500">warning</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Delete Product?</h3>
                            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductsPage;
