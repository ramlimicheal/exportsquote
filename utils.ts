import { Product, QuoteItem, Incoterm } from "./types";

export const CONTAINER_20FT_CBM = 33.2;

export const calculateCBM = (l: number, w: number, h: number): number => {
    // Input cm, output m3
    return (l * w * h) / 1000000;
};

export const calculateItemMetrics = (product: Product, qty: number) => {
    const cbm = calculateCBM(product.dimensions.length, product.dimensions.width, product.dimensions.height);
    const totalVolume = cbm * qty;
    const totalWeight = product.weight * qty;
    const totalCost = product.costPrice * qty;
    return { totalVolume, totalWeight, totalCost };
};

export const calculateShipping = (weight: number, volume: number, incoterm: Incoterm): number => {
    // Simplified logic: Volumetric Weight vs Actual Weight
    const volumetricWeight = volume * 167; // Air freight constant, used as proxy
    const chargeableWeight = Math.max(weight, volumetricWeight);
    
    // Base Rates per kg based on Incoterm
    let ratePerKg = 0;
    if (incoterm === 'EXW') ratePerKg = 0; // Buyer picks up
    if (incoterm === 'FOB') ratePerKg = 0.5; // Local transport to port
    if (incoterm === 'CIF') ratePerKg = 3.5; // Ocean freight + Insurance
    if (incoterm === 'DDP') ratePerKg = 5.0; // Door to door

    return chargeableWeight * ratePerKg;
};

export const getMarginColor = (margin: number): string => {
    if (margin < 10) return "text-red-500 bg-red-100";
    if (margin < 20) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
};
