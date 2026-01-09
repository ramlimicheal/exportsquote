import { Client, Product, Quote, Document, Shipment, Analytics, Notification, AIInsight, GoalMetric } from "./types";

// ============================================
// COMPREHENSIVE MOCK DATA FOR EXPORTFLOW PRO
// ============================================

export const CLIENTS: Record<string, Client> = {
  me: {
    id: "me",
    companyName: "ExportFlow Admin",
    contactName: "Alex Kumar",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATzkB96qx5wzlgZn_HXwjjNvN5deD9kQANENQeKzhvw7oVVYrQbF6JcuE_Vx5Hc4RJ9Ens9JlyBBK8vrJTfbLYFRgVDC_y1ltOOXMn9fsshfhjSh1Pl2JWH2aZ5bYPG4DTGzM-lBKJg5_VziFt9ADaZfzvP-y5Fi9A7x6AW5avLh9ZxKEfJN8m3uzUTTbV3bm1_7XojOmHN2l_Ms-sPFEsW7TH8M7ftRgrvO4-dZv5aReH3mXFJ1p3votzyuoK7zI3wOZC8NIry2o",
    location: "Mumbai, MH",
    country: "India",
    status: 'active',
    tier: 'platinum',
    riskLevel: 'low',
    riskScore: 15,
    createdAt: "2022-01-15"
  },
  tech_corp: {
    id: "c1",
    companyName: "Global Retail Partners",
    contactName: "Sarah Johnson",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFENGZT0eBOZXelQlXSIUX_0kGz2glFbQfAtt8KCRv0yUq-glDF-m7Lb5r-pwG0LMOONVz5l1HSK6rtYu8soMi6mSL_GFpCwVlC-DDHLKlyJAi9L7wYhc5fmnP5VFVIyVfenLLyCAV5P-splrXc3Qwkg73uDbH_SU1RsWs6w6dV4xEyjXRdhVNmDdTYxvh3jDmGTgePBkC8E_4P457HaT1JvQhmISkrmjlDGIxcoaGjtpXD9FfD7G-2J-Y862B6ETmx1coYnVOxzs",
    location: "Dubai, UAE",
    country: "UAE",
    status: 'active',
    tier: 'gold',
    creditLimit: "$75,000",
    creditUsed: 28500,
    preferredIncoterm: 'CIF',
    preferredCurrency: 'USD',
    riskLevel: 'low',
    riskScore: 22,
    industry: "Retail",
    annualVolume: 425000,
    lastOrderDate: "2025-12-15",
    lifetimeValue: 1250000,
    email: "sarah.johnson@globalretail.ae",
    phone: "+971 4 555 1234",
    website: "https://globalretailpartners.ae",
    taxId: "TRN-100234567890123",
    tags: ['premium', 'fast-payer', 'textiles'],
    createdAt: "2022-06-20"
  },
  fash_inc: {
    id: "c2",
    companyName: "Fashion Forward Inc",
    contactName: "Michael Chen",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9fRTiMm3tYm3LmqI8xlDKg_JUYu0ouSYA-KzK5_RF0N-Taj82TuIOAtFTpaFWyQXv4H17vWWfswlBEiOZk32x7mgixWnzcLzgaCsGIPa8EwPoqQEAy3f0Mk3lKZkPaDgf2bZ57tTfW8Kkh9BuXRXUWMa64a6yHtNfMbeTihnygYaxN4-4JW7xgYSCowkzdVsEY2z_gXL9qDps4eld5B83jWUK-n3Qs5sY5_BG3v0461aJk6EI1LGGxA-ju7ky1NCzmuun_cqL9aY",
    location: "Singapore",
    country: "Singapore",
    status: 'active',
    tier: 'silver',
    creditLimit: "$35,000",
    creditUsed: 12500,
    preferredIncoterm: 'FOB',
    preferredCurrency: 'USD',
    riskLevel: 'medium',
    riskScore: 45,
    industry: "Fashion & Apparel",
    annualVolume: 185000,
    lastOrderDate: "2025-11-28",
    lifetimeValue: 520000,
    email: "m.chen@fashionforward.sg",
    phone: "+65 6234 5678",
    tags: ['growing', 'fashion'],
    createdAt: "2023-02-10"
  },
  build_co: {
    id: "c3",
    companyName: "BuildRight Construction",
    contactName: "John Smith",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvjx6KuMOl-lr5nJxa4_5Bev7gkFDQObr5TrhcT6jPB3HW3Pm3QipUUrj_9LKTP0wXYPfonP_orowv5qGR3vd08aDHRPJCtTqV6sSUeom8-pZAvUeebkjjsRHcByAFBd4Wr2W-fbYoFPLkp7FX1ERYbazLZ5PCWSJTm3AqJbh_dSdJ0nGQKUxfIAbPBMz_ZetMSFJCeW2bWiYp9TJw-NWK9kxZkEYB5MkBbI-pMKPnoyvrJeoXyWLNycRWy_VQYisa4gpdnlArLBc",
    location: "Rotterdam, NL",
    country: "Netherlands",
    status: 'active',
    tier: 'platinum',
    creditLimit: "$150,000",
    creditUsed: 45000,
    preferredIncoterm: 'DDP',
    preferredCurrency: 'EUR',
    riskLevel: 'low',
    riskScore: 12,
    industry: "Construction",
    annualVolume: 850000,
    lastOrderDate: "2025-12-22",
    lifetimeValue: 2150000,
    email: "j.smith@buildright.nl",
    phone: "+31 10 555 9876",
    website: "https://buildright.nl",
    tags: ['enterprise', 'machinery', 'reliable'],
    createdAt: "2021-09-05"
  },
  spice_world: {
    id: "c4",
    companyName: "SpiceWorld Trading",
    contactName: "Ahmed Al-Hassan",
    avatar: "https://ui-avatars.com/api/?name=SW&background=F59E0B&color=fff&size=200",
    location: "Riyadh, SA",
    country: "Saudi Arabia",
    status: 'active',
    tier: 'gold',
    creditLimit: "$60,000",
    creditUsed: 18000,
    preferredIncoterm: 'CIF',
    preferredCurrency: 'USD',
    riskLevel: 'low',
    riskScore: 28,
    industry: "Food & Spices",
    annualVolume: 320000,
    lastOrderDate: "2025-12-18",
    lifetimeValue: 890000,
    email: "ahmed@spiceworld.sa",
    phone: "+966 11 456 7890",
    tags: ['spices', 'bulk-buyer'],
    createdAt: "2022-11-15"
  },
  pharma_plus: {
    id: "c5",
    companyName: "PharmaPure International",
    contactName: "Dr. Lisa Wong",
    avatar: "https://ui-avatars.com/api/?name=PP&background=10B981&color=fff&size=200",
    location: "Hong Kong",
    country: "Hong Kong",
    status: 'pending',
    tier: 'silver',
    creditLimit: "$25,000",
    creditUsed: 0,
    preferredIncoterm: 'FOB',
    preferredCurrency: 'USD',
    riskLevel: 'medium',
    riskScore: 55,
    industry: "Pharmaceuticals",
    annualVolume: 0,
    lifetimeValue: 0,
    email: "l.wong@pharmapure.hk",
    phone: "+852 2345 6789",
    tags: ['new', 'pharma', 'potential'],
    createdAt: "2025-12-01"
  },
  textile_masters: {
    id: "c6",
    companyName: "Textile Masters EU",
    contactName: "Marco Rossi",
    avatar: "https://ui-avatars.com/api/?name=TM&background=6366F1&color=fff&size=200",
    location: "Milan, IT",
    country: "Italy",
    status: 'active',
    tier: 'gold',
    creditLimit: "$80,000",
    creditUsed: 32000,
    preferredIncoterm: 'CIF',
    preferredCurrency: 'EUR',
    riskLevel: 'low',
    riskScore: 18,
    industry: "Textiles",
    annualVolume: 520000,
    lastOrderDate: "2025-12-10",
    lifetimeValue: 1450000,
    email: "m.rossi@textilemasters.it",
    phone: "+39 02 8765 4321",
    website: "https://textilemasters.eu",
    tags: ['premium', 'textiles', 'europe'],
    createdAt: "2022-03-22"
  },
  east_trade: {
    id: "c7",
    companyName: "Eastern Trade Corp",
    contactName: "Yuki Tanaka",
    avatar: "https://ui-avatars.com/api/?name=ET&background=EC4899&color=fff&size=200",
    location: "Tokyo, JP",
    country: "Japan",
    status: 'at_risk',
    tier: 'bronze',
    creditLimit: "$20,000",
    creditUsed: 18500,
    preferredIncoterm: 'FOB',
    preferredCurrency: 'USD',
    riskLevel: 'high',
    riskScore: 72,
    industry: "General Trading",
    annualVolume: 85000,
    lastOrderDate: "2025-09-15",
    lifetimeValue: 210000,
    email: "y.tanaka@easterntrade.jp",
    phone: "+81 3 1234 5678",
    tags: ['at-risk', 'slow-payer'],
    createdAt: "2023-07-10"
  },
  africa_imports: {
    id: "c8",
    companyName: "Pan-Africa Imports",
    contactName: "Kwame Asante",
    avatar: "https://ui-avatars.com/api/?name=PA&background=8B5CF6&color=fff&size=200",
    location: "Accra, GH",
    country: "Ghana",
    status: 'active',
    tier: 'silver',
    creditLimit: "$40,000",
    creditUsed: 15000,
    preferredIncoterm: 'CIF',
    preferredCurrency: 'USD',
    riskLevel: 'medium',
    riskScore: 42,
    industry: "Distribution",
    annualVolume: 180000,
    lastOrderDate: "2025-12-05",
    lifetimeValue: 420000,
    email: "k.asante@panafricaimports.gh",
    phone: "+233 30 276 5432",
    tags: ['africa', 'distribution', 'growing'],
    createdAt: "2023-04-18"
  }
};

// Comprehensive Product Catalog
export const PRODUCTS: Product[] = [
  {
    id: "p1", name: "Premium Cotton Yarn 40s", sku: "TX-CY-001",
    unitPrice: 450, costPrice: 380, unit: "kg", weight: 1,
    dimensions: { length: 20, width: 20, height: 10 },
    hsCode: "5205.11", icon: "inventory_2",
    category: "textiles",
    description: "High-quality combed cotton yarn, 40s count, suitable for premium apparel",
    minOrderQty: 100, leadTimeDays: 14, inStock: 5000, reorderLevel: 1000,
    supplier: "Tamil Nadu Textiles", certifications: ["OEKO-TEX", "GOTS"],
    isActive: true, createdAt: "2023-01-15"
  },
  {
    id: "p2", name: "Green Cardamom (8mm)", sku: "SP-CD-022",
    unitPrice: 2200, costPrice: 1600, unit: "kg", weight: 1,
    dimensions: { length: 15, width: 10, height: 5 },
    hsCode: "0908.31", icon: "restaurant",
    category: "spices",
    description: "Premium grade green cardamom, 8mm bold, from Kerala plantations",
    minOrderQty: 25, leadTimeDays: 7, inStock: 850, reorderLevel: 200,
    supplier: "Kerala Spice Gardens", certifications: ["FSSAI", "Spices Board"],
    isActive: true, createdAt: "2023-02-20"
  },
  {
    id: "p3", name: "Industrial Gate Valve DN100", sku: "MN-GV-550",
    unitPrice: 1500, costPrice: 900, unit: "unit", weight: 12,
    dimensions: { length: 40, width: 30, height: 30 },
    hsCode: "8481.80", icon: "settings_suggest",
    category: "machinery",
    description: "Cast steel gate valve, DN100, PN16, flanged ends, API 600 certified",
    minOrderQty: 10, leadTimeDays: 21, inStock: 120, reorderLevel: 25,
    supplier: "Gujarat Valves Ltd", certifications: ["API 600", "CE", "ISO 9001"],
    isActive: true, createdAt: "2023-03-10"
  },
  {
    id: "p4", name: "Export Carton Box 60x40x40", sku: "PK-CB-100",
    unitPrice: 25, costPrice: 15, unit: "box", weight: 0.5,
    dimensions: { length: 60, width: 40, height: 40 },
    hsCode: "4819.10", icon: "local_shipping",
    category: "packaging",
    description: "5-ply corrugated export carton, double wall, burst strength 18 kg/cm²",
    minOrderQty: 500, leadTimeDays: 5, inStock: 8000, reorderLevel: 2000,
    supplier: "Mumbai Packaging Co",
    isActive: true, createdAt: "2023-01-05"
  },
  {
    id: "p5", name: "Turmeric Powder (Alleppey)", sku: "SP-TP-015",
    unitPrice: 850, costPrice: 620, unit: "kg", weight: 1,
    dimensions: { length: 20, width: 15, height: 10 },
    hsCode: "0910.30", icon: "restaurant",
    category: "spices",
    description: "Alleppey turmeric powder, 5% curcumin content, vacuum packed",
    minOrderQty: 50, leadTimeDays: 7, inStock: 2000, reorderLevel: 500,
    supplier: "Kerala Spice Gardens", certifications: ["FSSAI", "Organic India"],
    isActive: true, createdAt: "2023-04-12"
  },
  {
    id: "p6", name: "Silk Saree (Kanchipuram)", sku: "TX-KS-088",
    unitPrice: 12000, costPrice: 8500, unit: "piece", weight: 0.8,
    dimensions: { length: 35, width: 25, height: 5 },
    hsCode: "5007.20", icon: "checkroom",
    category: "textiles",
    description: "Authentic Kanchipuram silk saree, pure mulberry silk, zari border",
    minOrderQty: 5, leadTimeDays: 30, inStock: 45, reorderLevel: 10,
    supplier: "Kanchipuram Weavers", certifications: ["GI Tag", "Silk Mark"],
    isActive: true, createdAt: "2023-05-18"
  },
  {
    id: "p7", name: "Ball Valve SS316 DN50", sku: "MN-BV-320",
    unitPrice: 850, costPrice: 520, unit: "unit", weight: 4.5,
    dimensions: { length: 20, width: 15, height: 15 },
    hsCode: "8481.80", icon: "settings_suggest",
    category: "machinery",
    description: "Stainless steel 316 ball valve, DN50, full bore, 1000 WOG",
    minOrderQty: 20, leadTimeDays: 14, inStock: 250, reorderLevel: 50,
    supplier: "Gujarat Valves Ltd", certifications: ["CE", "ISO 9001"],
    isActive: true, createdAt: "2023-06-22"
  },
  {
    id: "p8", name: "Black Pepper (MG1)", sku: "SP-BP-008",
    unitPrice: 1100, costPrice: 780, unit: "kg", weight: 1,
    dimensions: { length: 15, width: 10, height: 8 },
    hsCode: "0904.11", icon: "restaurant",
    category: "spices",
    description: "Malabar Garbled 1 grade black pepper, 550 g/L bulk density",
    minOrderQty: 50, leadTimeDays: 7, inStock: 1500, reorderLevel: 400,
    supplier: "Kerala Spice Gardens", certifications: ["FSSAI", "Spices Board"],
    isActive: true, createdAt: "2023-07-05"
  },
  {
    id: "p9", name: "Cotton Fabric (Cambric)", sku: "TX-CF-045",
    unitPrice: 280, costPrice: 195, unit: "kg", weight: 1,
    dimensions: { length: 100, width: 30, height: 30 },
    hsCode: "5208.21", icon: "inventory_2",
    category: "textiles",
    description: "60s cotton cambric fabric, 58 inch width, bleached white",
    minOrderQty: 200, leadTimeDays: 10, inStock: 3500, reorderLevel: 800,
    supplier: "Tamil Nadu Textiles", certifications: ["OEKO-TEX"],
    isActive: true, createdAt: "2023-08-14"
  },
  {
    id: "p10", name: "Pressure Gauge 0-16 Bar", sku: "MN-PG-110",
    unitPrice: 120, costPrice: 68, unit: "unit", weight: 0.3,
    dimensions: { length: 10, width: 10, height: 8 },
    hsCode: "9026.20", icon: "speed",
    category: "machinery",
    description: "Bourdon tube pressure gauge, 100mm dial, SS case, glycerin filled",
    minOrderQty: 50, leadTimeDays: 7, inStock: 500, reorderLevel: 100,
    supplier: "Pune Instruments", certifications: ["CE"],
    isActive: true, createdAt: "2023-09-02"
  },
  {
    id: "p11", name: "Cumin Seeds (Singapore)", sku: "SP-CS-012",
    unitPrice: 950, costPrice: 680, unit: "kg", weight: 1,
    dimensions: { length: 15, width: 10, height: 8 },
    hsCode: "0909.31", icon: "restaurant",
    category: "spices",
    description: "Singapore quality cumin seeds, machine cleaned, 99% purity",
    minOrderQty: 50, leadTimeDays: 5, inStock: 1200, reorderLevel: 300,
    supplier: "Gujarat Spices", certifications: ["FSSAI"],
    isActive: true, createdAt: "2023-10-18"
  },
  {
    id: "p12", name: "Jute Bags (50kg capacity)", sku: "PK-JB-055",
    unitPrice: 8, costPrice: 5, unit: "piece", weight: 0.4,
    dimensions: { length: 80, width: 50, height: 2 },
    hsCode: "6305.10", icon: "shopping_bag",
    category: "packaging",
    description: "Food grade jute bags, 50kg capacity, laminated inside",
    minOrderQty: 1000, leadTimeDays: 10, inStock: 15000, reorderLevel: 5000,
    supplier: "Bengal Jute Mills",
    isActive: true, createdAt: "2023-11-25"
  }
];

export const INITIAL_QUOTE: Quote = {
  id: "q-1024",
  reference: "QT-2024-001",
  client: CLIENTS.tech_corp,
  status: "Draft",
  date: "Oct 24, 2024",
  items: [
    {
      id: "qi-1", product: PRODUCTS[0], quantity: 500, total: 225000,
      totalWeight: 500, totalVolume: 2 // 500 * 0.004
    },
    {
      id: "qi-2", product: PRODUCTS[3], quantity: 100, total: 2500,
      totalWeight: 50, totalVolume: 1.25 // 100 * 0.0125
    }
  ],
  subtotal: 227500,
  shippingCost: 15000,
  insuranceCost: 2000,
  tax: 40950,
  total: 285450,
  margin: 18.5,
  destination: "Navi Mumbai Port",
  incoterm: 'CIF',
  containerUtilization: 10.5
};

export const RECENT_QUOTES: Partial<Quote>[] = [
  { id: "q-1023", reference: "QT-2024-005", client: CLIENTS.fash_inc, status: "Sent", total: 12500, date: "2h ago" },
  { id: "q-1022", reference: "QT-2024-004", client: CLIENTS.build_co, status: "Approved", total: 850000, date: "Yesterday" },
  { id: "q-1021", reference: "QT-2024-003", client: CLIENTS.tech_corp, status: "Draft", total: 45000, date: "Oct 22" }
];

export const DOCUMENTS: Document[] = [
  { id: "d1", name: "Invoice_INV001.pdf", type: "invoice", size: "1.2 MB", date: "2024-10-24" },
  { id: "d2", name: "Packing_List.xlsx", type: "packing_list", size: "450 KB", date: "2024-10-24" }
];

// Shipments for Logistics Page
export const SHIPMENTS: Shipment[] = [
  {
    id: "sh-001",
    quoteRef: "QT-2024-004",
    client: CLIENTS.build_co,
    status: "in_transit",
    origin: "Chennai Port, IN",
    destination: "Rotterdam, NL",
    shipDate: "2024-10-20",
    eta: "2024-11-15",
    container: "40ft",
    trackingNumber: "MSCU4567890",
    weight: 12500,
    volume: 28.5
  },
  {
    id: "sh-002",
    quoteRef: "QT-2024-003",
    client: CLIENTS.tech_corp,
    status: "customs",
    origin: "Mumbai Port, IN",
    destination: "Dubai, UAE",
    shipDate: "2024-10-18",
    eta: "2024-10-28",
    container: "20ft",
    trackingNumber: "HLCU2345678",
    weight: 4500,
    volume: 15.2
  },
  {
    id: "sh-003",
    quoteRef: "QT-2024-005",
    client: CLIENTS.fash_inc,
    status: "pending",
    origin: "Delhi ICD, IN",
    destination: "Singapore, SG",
    shipDate: "2024-10-28",
    eta: "2024-11-08",
    container: "20ft",
    weight: 2800,
    volume: 12.0
  },
  {
    id: "sh-004",
    quoteRef: "QT-2024-001",
    client: CLIENTS.tech_corp,
    status: "delivered",
    origin: "Chennai Port, IN",
    destination: "Los Angeles, US",
    shipDate: "2024-09-15",
    eta: "2024-10-10",
    container: "40ft_hq",
    trackingNumber: "OOLU8901234",
    weight: 18000,
    volume: 58.5
  }
];

// Analytics for Reports Page
export const ANALYTICS: Analytics = {
  totalRevenue: 1285450,
  totalQuotes: 24,
  approvedQuotes: 18,
  conversionRate: 75,
  avgQuoteValue: 53560,
  topProducts: [
    { product: PRODUCTS[2], unitsSold: 450, revenue: 675000 },
    { product: PRODUCTS[0], unitsSold: 1200, revenue: 540000 },
    { product: PRODUCTS[1], unitsSold: 85, revenue: 187000 },
    { product: PRODUCTS[3], unitsSold: 2400, revenue: 60000 }
  ],
  topClients: [
    { client: CLIENTS.build_co, totalQuotes: 8, revenue: 650000, conversionRate: 87 },
    { client: CLIENTS.tech_corp, totalQuotes: 10, revenue: 425000, conversionRate: 70 },
    { client: CLIENTS.fash_inc, totalQuotes: 6, revenue: 210450, conversionRate: 67 }
  ],
  monthlyData: [
    { month: "May", revenue: 125000, quotes: 4, conversions: 3 },
    { month: "Jun", revenue: 180000, quotes: 5, conversions: 4 },
    { month: "Jul", revenue: 210000, quotes: 6, conversions: 5 },
    { month: "Aug", revenue: 195000, quotes: 5, conversions: 4 },
    { month: "Sep", revenue: 285000, quotes: 7, conversions: 6 },
    { month: "Oct", revenue: 290450, quotes: 6, conversions: 5 }
  ]
};

// Incoterm descriptions for Logistics page
export const INCOTERM_INFO: Record<string, { name: string; description: string; seller: string; buyer: string }> = {
  EXW: {
    name: "Ex Works",
    description: "Seller makes goods available at their premises",
    seller: "Makes goods available, provides commercial invoice",
    buyer: "Bears all costs and risks from seller's premises"
  },
  FOB: {
    name: "Free on Board",
    description: "Seller delivers goods on board the vessel",
    seller: "Delivers goods on vessel, clears export, pays to port",
    buyer: "Pays freight, insurance, import duties, risks after loading"
  },
  CIF: {
    name: "Cost, Insurance & Freight",
    description: "Seller pays for freight and insurance to destination",
    seller: "Pays freight, provides insurance, delivers to port",
    buyer: "Bears risks after goods loaded, pays import duties"
  },
  DDP: {
    name: "Delivered Duty Paid",
    description: "Seller delivers goods cleared for import at destination",
    seller: "Bears all costs and risks to destination, pays duties",
    buyer: "Only unloads goods at destination"
  }
};
