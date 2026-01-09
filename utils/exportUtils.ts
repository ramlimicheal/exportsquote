import { Quote, Client, Product, Shipment } from '../types';

/**
 * Converts an array of objects to CSV format
 */
export function toCSV<T extends Record<string, unknown>>(
    data: T[],
    columns: { key: keyof T; label: string }[]
): string {
    if (data.length === 0) return '';

    // Header row
    const header = columns.map(col => `"${col.label}"`).join(',');

    // Data rows
    const rows = data.map(item =>
        columns
            .map(col => {
                const value = item[col.key];
                if (value === null || value === undefined) return '""';
                if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                return `"${String(value).replace(/"/g, '""')}"`;
            })
            .join(',')
    );

    return [header, ...rows].join('\n');
}

/**
 * Downloads a string as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export quotes to CSV
 */
export function exportQuotesToCSV(quotes: Partial<Quote>[]): void {
    const columns = [
        { key: 'reference' as const, label: 'Reference' },
        { key: 'status' as const, label: 'Status' },
        { key: 'date' as const, label: 'Date' },
        { key: 'total' as const, label: 'Total' },
        { key: 'currency' as const, label: 'Currency' },
        { key: 'incoterm' as const, label: 'Incoterm' },
        { key: 'origin' as const, label: 'Origin' },
        { key: 'destination' as const, label: 'Destination' },
    ];

    const dataWithClientName = quotes.map(q => ({
        ...q,
        clientName: q.client?.companyName || 'N/A',
    }));

    const extendedColumns = [
        ...columns.slice(0, 2),
        { key: 'clientName' as keyof typeof dataWithClientName[0], label: 'Client' },
        ...columns.slice(2),
    ];

    const csv = toCSV(dataWithClientName, extendedColumns as any);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `exportflow-quotes-${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export clients to CSV
 */
export function exportClientsToCSV(clients: Client[]): void {
    const columns = [
        { key: 'companyName' as const, label: 'Company Name' },
        { key: 'contactName' as const, label: 'Contact Name' },
        { key: 'email' as const, label: 'Email' },
        { key: 'phone' as const, label: 'Phone' },
        { key: 'location' as const, label: 'Location' },
        { key: 'country' as const, label: 'Country' },
        { key: 'status' as const, label: 'Status' },
        { key: 'tier' as const, label: 'Tier' },
        { key: 'creditLimit' as const, label: 'Credit Limit' },
        { key: 'riskLevel' as const, label: 'Risk Level' },
        { key: 'industry' as const, label: 'Industry' },
    ];

    const csv = toCSV(clients, columns);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `exportflow-clients-${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export products to CSV
 */
export function exportProductsToCSV(products: Product[]): void {
    const columns = [
        { key: 'name' as const, label: 'Name' },
        { key: 'sku' as const, label: 'SKU' },
        { key: 'hsCode' as const, label: 'HS Code' },
        { key: 'unitPrice' as const, label: 'Unit Price' },
        { key: 'costPrice' as const, label: 'Cost Price' },
        { key: 'unit' as const, label: 'Unit' },
        { key: 'weight' as const, label: 'Weight (kg)' },
        { key: 'category' as const, label: 'Category' },
        { key: 'inStock' as const, label: 'In Stock' },
        { key: 'isActive' as const, label: 'Active' },
    ];

    const csv = toCSV(products, columns);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `exportflow-products-${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export shipments to CSV
 */
export function exportShipmentsToCSV(shipments: Shipment[]): void {
    const dataWithClientName = shipments.map(s => ({
        ...s,
        clientName: s.client?.companyName || 'N/A',
    }));

    const columns = [
        { key: 'id' as const, label: 'Shipment ID' },
        { key: 'quoteRef' as const, label: 'Quote Ref' },
        { key: 'clientName' as keyof typeof dataWithClientName[0], label: 'Client' },
        { key: 'status' as const, label: 'Status' },
        { key: 'origin' as const, label: 'Origin' },
        { key: 'destination' as const, label: 'Destination' },
        { key: 'shipDate' as const, label: 'Ship Date' },
        { key: 'eta' as const, label: 'ETA' },
        { key: 'carrier' as const, label: 'Carrier' },
        { key: 'container' as const, label: 'Container' },
        { key: 'weight' as const, label: 'Weight (kg)' },
        { key: 'totalCost' as const, label: 'Total Cost' },
    ];

    const csv = toCSV(dataWithClientName, columns as any);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `exportflow-shipments-${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Generate PDF-style HTML for a quote (can be printed to PDF)
 */
export function generateQuotePDF(quote: Partial<Quote>): string {
    const items = quote.items || [];
    const itemRows = items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.unitPrice.toLocaleString()}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.total.toLocaleString()}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Quote ${quote.reference}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
        .quote-info { text-align: right; }
        .quote-number { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
        .client-section { display: flex; justify-content: space-between; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th { background: #3B82F6; color: white; padding: 12px; text-align: left; }
        th:last-child, th:nth-child(2), th:nth-child(3) { text-align: right; }
        th:nth-child(2) { text-align: center; }
        .totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total-row.grand { font-size: 18px; font-weight: bold; border-bottom: none; border-top: 2px solid #333; margin-top: 8px; padding-top: 16px; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .terms { margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; }
        .terms h4 { margin: 0 0 10px 0; color: #92400e; }
        .terms p { margin: 0; font-size: 13px; color: #92400e; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🚀 ExportFlow</div>
        <div class="quote-info">
            <div class="quote-number">${quote.reference}</div>
            <div>Date: ${quote.date}</div>
            <div>Valid Until: ${quote.validUntil || 'N/A'}</div>
            <div>Status: ${quote.status}</div>
        </div>
    </div>

    <div class="client-section">
        <div>
            <strong>Bill To:</strong><br>
            ${quote.client?.companyName || 'N/A'}<br>
            ${quote.client?.contactName || ''}<br>
            ${quote.client?.location || ''}<br>
            ${quote.client?.email || ''}
        </div>
        <div style="text-align: right;">
            <strong>Shipping:</strong><br>
            Origin: ${quote.origin || 'N/A'}<br>
            Destination: ${quote.destination || 'N/A'}<br>
            Incoterm: ${quote.incoterm || 'N/A'}<br>
            Currency: ${quote.currency || 'USD'}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${itemRows || '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #999;">No items</td></tr>'}
        </tbody>
    </table>

    <div class="totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>$${(quote.subtotal || 0).toLocaleString()}</span>
        </div>
        <div class="total-row">
            <span>Shipping:</span>
            <span>$${(quote.shippingCost || 0).toLocaleString()}</span>
        </div>
        <div class="total-row">
            <span>Insurance:</span>
            <span>$${(quote.insuranceCost || 0).toLocaleString()}</span>
        </div>
        <div class="total-row">
            <span>Tax:</span>
            <span>$${(quote.tax || 0).toLocaleString()}</span>
        </div>
        <div class="total-row grand">
            <span>Total:</span>
            <span>$${(quote.total || 0).toLocaleString()}</span>
        </div>
    </div>

    <div class="terms">
        <h4>⚠️ Terms & Conditions</h4>
        <p>${quote.paymentTerms || 'Payment terms as per agreement. Quote valid for 30 days from date of issue.'}</p>
    </div>

    <div class="footer">
        <p>Generated by ExportFlow • ${new Date().toLocaleString()}</p>
        <p>This is a computer-generated document. No signature required.</p>
    </div>
</body>
</html>
    `;
}

/**
 * Open quote as printable PDF (print dialog)
 */
export function printQuote(quote: Partial<Quote>): void {
    const html = generateQuotePDF(quote);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    }
}

/**
 * Export analytics report to CSV
 */
export function exportAnalyticsToCSV(analytics: {
    totalRevenue: number;
    totalQuotes: number;
    conversionRate: number;
    avgMargin: number;
    monthlyData?: { month: string; revenue: number; quotes: number }[];
}): void {
    // Summary data
    const summaryData = [
        { metric: 'Total Revenue', value: `$${analytics.totalRevenue.toLocaleString()}` },
        { metric: 'Total Quotes', value: analytics.totalQuotes.toString() },
        { metric: 'Conversion Rate', value: `${analytics.conversionRate}%` },
        { metric: 'Average Margin', value: `${analytics.avgMargin}%` },
    ];

    const summaryColumns = [
        { key: 'metric' as const, label: 'Metric' },
        { key: 'value' as const, label: 'Value' },
    ];

    let csv = 'EXPORTFLOW ANALYTICS REPORT\n\n';
    csv += 'Summary\n';
    csv += toCSV(summaryData, summaryColumns);

    if (analytics.monthlyData && analytics.monthlyData.length > 0) {
        csv += '\n\nMonthly Data\n';
        const monthlyColumns = [
            { key: 'month' as const, label: 'Month' },
            { key: 'revenue' as const, label: 'Revenue' },
            { key: 'quotes' as const, label: 'Quotes' },
        ];
        csv += toCSV(analytics.monthlyData, monthlyColumns);
    }

    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `exportflow-analytics-${timestamp}.csv`, 'text/csv;charset=utf-8;');
}
