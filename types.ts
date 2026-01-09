// ============================================
// ENHANCED DOMAIN MODEL FOR EXPORTFLOW PRO
// ============================================

// Client & CRM Types
export type ClientStatus = 'active' | 'pending' | 'inactive' | 'at_risk' | 'churned';
export type ClientTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ClientContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isPrimary: boolean;
}

export interface ClientNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  type: 'general' | 'call' | 'meeting' | 'email' | 'warning';
}

export interface PaymentHistory {
  id: string;
  invoiceRef: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  avatar: string;
  location: string;
  country: string;
  status: ClientStatus;
  tier: ClientTier;
  creditLimit?: string;
  creditUsed?: number;
  preferredIncoterm?: Incoterm;
  preferredCurrency?: Currency;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  contacts?: ClientContact[];
  notes?: ClientNote[];
  paymentHistory?: PaymentHistory[];
  tags?: string[];
  industry?: string;
  annualVolume?: number;
  lastOrderDate?: string;
  lifetimeValue?: number;
  createdAt: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
}

// Product Types
export interface Dimensions {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
}

export type ProductCategory = 'textiles' | 'spices' | 'machinery' | 'packaging' | 'chemicals' | 'electronics' | 'pharmaceuticals' | 'food' | 'other';

export interface Product {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  costPrice: number; // For Margin Shield
  unit: 'kg' | 'ton' | 'unit' | 'box' | 'liter' | 'piece';
  weight: number; // kg per unit
  dimensions: Dimensions;
  hsCode: string;
  icon: string;
  category: ProductCategory;
  description?: string;
  minOrderQty?: number;
  leadTimeDays?: number;
  inStock?: number;
  reorderLevel?: number;
  supplier?: string;
  certifications?: string[];
  exportRestrictions?: string[];
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Quote Types
export interface QuoteItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number; // Can override product price
  discount?: number; // Percentage
  total: number;
  totalWeight: number; // kg
  totalVolume: number; // cbm
  notes?: string;
}

export type Incoterm = 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'CNY';
export type QuoteStatus = 'Draft' | 'Sent' | 'Negotiating' | 'Approved' | 'Rejected' | 'Expired' | 'Converted';
export type QuotePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface QuoteVersion {
  id: string;
  version: number;
  createdAt: string;
  changes: string;
  total: number;
}

export interface Quote {
  id: string;
  reference: string;
  client: Client;
  status: QuoteStatus;
  priority: QuotePriority;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  shippingCost: number;
  insuranceCost: number;
  handlingFee: number;
  discount: number;
  tax: number;
  total: number;
  totalCost: number; // Cost price total
  margin: number; // Profit percentage
  marginAmount: number; // Absolute profit
  currency: Currency;
  exchangeRate: number;
  origin: string;
  destination: string;
  destinationPort?: string;
  incoterm: Incoterm;
  paymentTerms: string;
  containerUtilization: number;
  estimatedDeliveryDays: number;
  notes?: string;
  internalNotes?: string;
  versions?: QuoteVersion[];
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  approvedAt?: string;
  convertedToOrderAt?: string;
  assignedTo?: string;
  tags?: string[];
}

// Document Types
export type DocumentType = 'invoice' | 'proforma' | 'packing_list' | 'bill_of_lading' | 'certificate_of_origin' | 'phytosanitary' | 'insurance' | 'contract' | 'customs_declaration' | 'other';
export type DocumentStatus = 'draft' | 'pending_review' | 'approved' | 'sent' | 'signed';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  size: string;
  date: string;
  quoteRef?: string;
  shipmentRef?: string;
  clientId?: string;
  url?: string;
  signedBy?: string;
  signedAt?: string;
  expiresAt?: string;
  version: number;
  createdBy: string;
  tags?: string[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  description: string;
  fields: string[];
  isDefault: boolean;
  createdAt: string;
}

// View types for navigation
export type ViewType = 'dashboard' | 'quotes' | 'products' | 'logistics' | 'clients' | 'reports' | 'documents' | 'settings' | 'profile';

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
export type ShipmentStatus = 'booked' | 'pending' | 'picked_up' | 'in_transit' | 'at_port' | 'customs' | 'out_for_delivery' | 'delivered' | 'exception';
export type ContainerType = '20ft' | '40ft' | '40ft_hq' | 'lcl' | 'ftl';
export type TransportMode = 'sea' | 'air' | 'road' | 'rail' | 'multimodal';

export interface ShipmentMilestone {
  id: string;
  status: ShipmentStatus;
  location: string;
  timestamp: string;
  description: string;
  isCompleted: boolean;
}

export interface Shipment {
  id: string;
  quoteRef: string;
  orderRef?: string;
  client: Client;
  status: ShipmentStatus;
  origin: string;
  originPort?: string;
  destination: string;
  destinationPort?: string;
  shipDate: string;
  eta: string;
  actualDeliveryDate?: string;
  container: ContainerType;
  transportMode: TransportMode;
  carrier?: string;
  vesselName?: string;
  voyageNumber?: string;
  trackingNumber?: string;
  blNumber?: string; // Bill of Lading
  weight: number;
  volume: number;
  chargeableWeight: number;
  freightCost: number;
  customsDuty?: number;
  insuranceCost?: number;
  totalCost: number;
  milestones?: ShipmentMilestone[];
  documents?: Document[];
  notes?: string;
  isUrgent: boolean;
  createdAt: string;
  updatedAt: string;
}

// Analytics for Reports page
export interface ProductPerformance {
  product: Product;
  unitsSold: number;
  revenue: number;
  margin: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface ClientPerformance {
  client: Client;
  totalQuotes: number;
  revenue: number;
  conversionRate: number;
  avgOrderValue: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyMetric {
  month: string;
  revenue: number;
  quotes: number;
  conversions: number;
  avgMargin: number;
  shipments: number;
  newClients: number;
}

export interface GoalMetric {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  trend: 'up' | 'down' | 'stable';
}

export interface Analytics {
  totalRevenue: number;
  totalQuotes: number;
  approvedQuotes: number;
  pendingQuotes: number;
  conversionRate: number;
  avgQuoteValue: number;
  avgMargin: number;
  totalShipments: number;
  onTimeDeliveryRate: number;
  activeClients: number;
  newClientsThisMonth: number;
  topProducts: ProductPerformance[];
  topClients: ClientPerformance[];
  monthlyData: MonthlyMetric[];
  goals: GoalMetric[];
  revenueByRegion: { region: string; revenue: number; percentage: number }[];
  revenueByIncoterm: { incoterm: Incoterm; revenue: number; count: number }[];
}

// AI & Intelligence Types
export interface AISuggestion {
  id: string;
  type: 'product' | 'pricing' | 'client' | 'incoterm' | 'container' | 'document' | 'risk';
  title: string;
  description: string;
  confidence: number; // 0-100
  action?: string;
  data?: any;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  category: 'opportunity' | 'warning' | 'trend' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  relatedEntityType?: 'quote' | 'client' | 'product' | 'shipment';
  relatedEntityId?: string;
  createdAt: string;
  dismissedAt?: string;
}

// Notification Types
export type NotificationType = 'quote' | 'shipment' | 'payment' | 'document' | 'client' | 'system' | 'alert';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

// Command Palette Types
export interface Command {
  id: string;
  name: string;
  shortcut?: string;
  icon?: string;
  category: 'navigation' | 'action' | 'search' | 'recent';
  action: () => void;
}

// Activity/Audit Log
export interface ActivityLog {
  id: string;
  action: string;
  entityType: 'quote' | 'client' | 'product' | 'shipment' | 'document';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  details?: string;
  previousValue?: any;
  newValue?: any;
  timestamp: string;
}

// User & Settings Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'sales' | 'operations' | 'viewer';
  permissions: string[];
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: Currency;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    quotes: boolean;
    shipments: boolean;
    payments: boolean;
  };
  dashboard: {
    defaultView: ViewType;
    widgets: string[];
  };
}

// Company Settings
export interface CompanySettings {
  name: string;
  logo?: string;
  address: string;
  country: string;
  currency: Currency;
  taxId?: string;
  exportLicense?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    swiftCode: string;
    iban?: string;
  };
  defaultIncoterm: Incoterm;
  defaultPaymentTerms: string;
  quoteValidityDays: number;
  lowMarginThreshold: number;
  containerUtilizationWarning: number;
}
