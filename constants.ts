import { Client, Product, Quote, Document, Shipment, Analytics } from "./types";

export const CLIENTS: Record<string, Client> = {
  me: {
    id: "me",
    companyName: "ExportFlow Admin",
    contactName: "Alex",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATzkB96qx5wzlgZn_HXwjjNvN5deD9kQANENQeKzhvw7oVVYrQbF6JcuE_Vx5Hc4RJ9Ens9JlyBBK8vrJTfbLYFRgVDC_y1ltOOXMn9fsshfhjSh1Pl2JWH2aZ5bYPG4DTGzM-lBKJg5_VziFt9ADaZfzvP-y5Fi9A7x6AW5avLh9ZxKEfJN8m3uzUTTbV3bm1_7XojOmHN2l_Ms-sPFEsW7TH8M7ftRgrvO4-dZv5aReH3mXFJ1p3votzyuoK7zI3wOZC8NIry2o",
    location: "HQ",
    status: 'active'
  },
  tech_corp: {
    id: "c1",
    companyName: "Domestic Retail Ltd",
    contactName: "Sarah Johnson",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFENGZT0eBOZXelQlXSIUX_0kGz2glFbQfAtt8KCRv0yUq-glDF-m7Lb5r-pwG0LMOONVz5l1HSK6rtYu8soMi6mSL_GFpCwVlC-DDHLKlyJAi9L7wYhc5fmnP5VFVIyVfenLLyCAV5P-splrXc3Qwkg73uDbH_SU1RsWs6w6dV4xEyjXRdhVNmDdTYxvh3jDmGTgePBkC8E_4P457HaT1JvQhmISkrmjlDGIxcoaGjtpXD9FfD7G-2J-Y862B6ETmx1coYnVOxzs",
    location: "Mumbai, MH",
    status: 'active',
    creditLimit: "$50,000",
    preferredIncoterm: 'CIF'
  },
  fash_inc: {
    id: "c2",
    companyName: "Fashion Forward Inc",
    contactName: "Michael Chen",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9fRTiMm3tYm3LmqI8xlDKg_JUYu0ouSYA-KzK5_RF0N-Taj82TuIOAtFTpaFWyQXv4H17vWWfswlBEiOZk32x7mgixWnzcLzgaCsGIPa8EwPoqQEAy3f0Mk3lKZkPaDgf2bZ57tTfW8Kkh9BuXRXUWMa64a6yHtNfMbeTihnygYaxN4-4JW7xgYSCowkzdVsEY2z_gXL9qDps4eld5B83jWUK-n3Qs5sY5_BG3v0461aJk6EI1LGGxA-ju7ky1NCzmuun_cqL9aY",
    location: "Bangalore, KA",
    status: 'pending',
    creditLimit: "$12,000"
  },
  build_co: {
    id: "c3",
    companyName: "BuildRight Supplies",
    contactName: "John Smith",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvjx6KuMOl-lr5nJxa4_5Bev7gkFDQObr5TrhcT6jPB3HW3Pm3QipUUrj_9LKTP0wXYPfonP_orowv5qGR3vd08aDHRPJCtTqV6sSUeom8-pZAvUeebkjjsRHcByAFBd4Wr2W-fbYoFPLkp7FX1ERYbazLZ5PCWSJTm3AqJbh_dSdJ0nGQKUxfIAbPBMz_ZetMSFJCeW2bWiYp9TJw-NWK9kxZkEYB5MkBbI-pMKPnoyvrJeoXyWLNycRWy_VQYisa4gpdnlArLBc",
    location: "Delhi, DL",
    status: 'active',
    creditLimit: "$100,000"
  }
};

// Products now have Weight (kg), Dimensions (cm), and Cost Price (for margin)
export const PRODUCTS: Product[] = [
  {
    id: "p1", name: "Premium Cotton Yarn", sku: "TX-CY-001",
    unitPrice: 450, costPrice: 380, unit: "kg", weight: 1,
    dimensions: { length: 20, width: 20, height: 10 }, // 0.004 cbm
    hsCode: "5205.11", icon: "inventory_2"
  },
  {
    id: "p2", name: "Spices - Cardamom", sku: "AG-SP-022",
    unitPrice: 2200, costPrice: 1600, unit: "kg", weight: 1,
    dimensions: { length: 15, width: 10, height: 5 },
    hsCode: "0908.31", icon: "restaurant"
  },
  {
    id: "p3", name: "Industrial Valve Set", sku: "MN-IV-550",
    unitPrice: 1500, costPrice: 900, unit: "unit", weight: 12,
    dimensions: { length: 40, width: 30, height: 30 }, // 0.036 cbm
    hsCode: "8481.80", icon: "settings_suggest"
  },
  {
    id: "p4", name: "Packaging Boxes (L)", sku: "PK-BX-100",
    unitPrice: 25, costPrice: 15, unit: "box", weight: 0.5,
    dimensions: { length: 50, width: 50, height: 5 },
    hsCode: "4819.10", icon: "local_shipping"
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
