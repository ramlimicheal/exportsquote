export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  avatar: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
  creditLimit?: string;
  preferredIncoterm?: Incoterm;
}

export interface Dimensions {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  costPrice: number; // For Margin Shield
  unit: 'kg' | 'ton' | 'unit' | 'box';
  weight: number; // kg per unit
  dimensions: Dimensions;
  hsCode: string;
  icon: string;
}

export interface QuoteItem {
  id: string;
  product: Product;
  quantity: number;
  total: number;
  totalWeight: number; // kg
  totalVolume: number; // cbm
}

export type Incoterm = 'EXW' | 'FOB' | 'CIF' | 'DDP';

export interface Quote {
  id: string;
  reference: string;
  client: Client;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected';
  date: string;
  items: QuoteItem[];
  subtotal: number;
  shippingCost: number;
  insuranceCost: number;
  tax: number;
  total: number;
  margin: number; // Profit percentage
  destination: string;
  incoterm: Incoterm;
  containerUtilization: number; // percentage of 20ft container
}

export interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'packing_list' | 'cert' | 'contract';
  size: string;
  date: string;
}

// View types for navigation
export type ViewType = 'quotes' | 'products' | 'logistics' | 'clients' | 'reports';

// Status filter types
export type QuoteStatusFilter = 'all' | 'Draft' | 'Sent' | 'Approved' | 'Rejected';

// Callback types for component communication
export interface AppCallbacks {
  onNavigate: (view: ViewType) => void;
  onSelectQuote: (quote: Partial<Quote>) => void;
  onSelectClient: (client: Client) => void;
  onCreateQuote: () => void;
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
  onToggleDarkMode: () => void;
  onClosePanel: () => void;
}

// Shipment for Logistics page
export type ShipmentStatus = 'pending' | 'in_transit' | 'customs' | 'delivered';
export type ContainerType = '20ft' | '40ft' | '40ft_hq';

export interface Shipment {
  id: string;
  quoteRef: string;
  client: Client;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  shipDate: string;
  eta: string;
  container: ContainerType;
  trackingNumber?: string;
  weight: number;
  volume: number;
}

// Analytics for Reports page
export interface ProductPerformance {
  product: Product;
  unitsSold: number;
  revenue: number;
}

export interface ClientPerformance {
  client: Client;
  totalQuotes: number;
  revenue: number;
  conversionRate: number;
}

export interface MonthlyMetric {
  month: string;
  revenue: number;
  quotes: number;
  conversions: number;
}

export interface Analytics {
  totalRevenue: number;
  totalQuotes: number;
  approvedQuotes: number;
  conversionRate: number;
  avgQuoteValue: number;
  topProducts: ProductPerformance[];
  topClients: ClientPerformance[];
  monthlyData: MonthlyMetric[];
}
