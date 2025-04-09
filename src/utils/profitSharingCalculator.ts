import { OrderItem } from '../types';

/**
 * Profit Sharing Calculator
 * 
 * This module documents and implements the profit sharing calculation logic.
 * 
 * The calculation follows these steps:
 * 
 * 1. Calculate Total Revenue
 *    - Sum of (selling price × quantity) for all items
 *    Example: 
 *      Item A: 149 SAR × 2 = 298 SAR
 *      Item B: 189 SAR × 1 = 189 SAR
 *      Total Revenue = 487 SAR
 * 
 * 2. For Each Product:
 *    a. Calculate Item Revenue
 *       - selling price × quantity
 *       Example: 149 SAR × 2 = 298 SAR
 * 
 *    b. Calculate Revenue Proportion
 *       - item revenue ÷ total revenue
 *       Example: 298 ÷ 487 = 0.612 (61.2%)
 * 
 *    c. Calculate Item's Share of Expenses
 *       - (shipping cost + payment fees) × revenue proportion
 *       Example: If total expenses are 30 SAR
 *       Item's expense share = 30 × 0.612 = 18.36 SAR
 * 
 *    d. Calculate Item's Cost
 *       - cost price × quantity
 *       Example: 70 SAR × 2 = 140 SAR
 * 
 *    e. Calculate Net Profit
 *       - (revenue - cost - expense share)
 *       Example: 298 - 140 - 18.36 = 139.64 SAR
 * 
 * 3. Apply Profit Sharing Percentages:
 *    Different products have different sharing ratios:
 *    - T-shirts: Yassir 50% / Ahmed 50%
 *    - Hoodies: Yassir 50% / Manal 50%
 *    - Others: Yassir 100%
 * 
 *    Example for T-shirt:
 *    Net Profit = 139.64 SAR
 *    Yassir's Share = 139.64 × 0.5 = 69.82 SAR
 *    Ahmed's Share = 139.64 × 0.5 = 69.82 SAR
 */

export interface ProfitShare {
  yassirShare: number;
  ahmedShare: number;
  manalShare: number;
}

export function calculateItemProfitShare(
  item: OrderItem,
  totalRevenue: number,
  totalExpenses: number
): ProfitShare & { 
  revenue: number;
  revenueProportion: number;
  expenseShare: number;
  cost: number;
  netProfit: number;
} {
  // Step 2a: Calculate Item Revenue
  const revenue = item.product.sellingPrice * item.quantity;
  
  // Step 2b: Calculate Revenue Proportion
  const revenueProportion = revenue / totalRevenue;
  
  // Step 2c: Calculate Expense Share
  const expenseShare = totalExpenses * revenueProportion;
  
  // Step 2d: Calculate Cost
  const cost = item.product.cost * item.quantity;
  
  // Step 2e: Calculate Net Profit
  const netProfit = revenue - cost - expenseShare;
  
  // Step 3: Apply Profit Sharing Percentages
  let yassirShare = 0;
  let ahmedShare = 0;
  let manalShare = 0;
  
  if (item.product.name.includes('T-SHIRT')) {
    // T-shirts are split 50/50 with Ahmed
    yassirShare = netProfit * 0.5;
    ahmedShare = netProfit * 0.5;
  } else if (item.product.name.includes('HOODIE')) {
    // Hoodies are split 50/50 with Manal
    yassirShare = netProfit * 0.5;
    manalShare = netProfit * 0.5;
  } else {
    // All other products are 100% Yassir's
    yassirShare = netProfit;
  }
  
  return {
    revenue,
    revenueProportion,
    expenseShare,
    cost,
    netProfit,
    yassirShare,
    ahmedShare,
    manalShare
  };
}

export function calculateTotalProfitShare(
  items: OrderItem[],
  totalExpenses: number
): {
  totalRevenue: number;
  itemShares: Array<ReturnType<typeof calculateItemProfitShare>>;
  totalYassirShare: number;
  totalAhmedShare: number;
  totalManalShare: number;
} {
  // Step 1: Calculate Total Revenue
  const totalRevenue = items.reduce(
    (sum, item) => sum + (item.product.sellingPrice * item.quantity),
    0
  );
  
  // Step 2 & 3: Calculate Individual Item Shares
  const itemShares = items.map(item => 
    calculateItemProfitShare(item, totalRevenue, totalExpenses)
  );
  
  // Calculate Totals
  const totalYassirShare = itemShares.reduce(
    (sum, share) => sum + share.yassirShare,
    0
  );
  
  const totalAhmedShare = itemShares.reduce(
    (sum, share) => sum + share.ahmedShare,
    0
  );
  
  const totalManalShare = itemShares.reduce(
    (sum, share) => sum + share.manalShare,
    0
  );
  
  return {
    totalRevenue,
    itemShares,
    totalYassirShare,
    totalAhmedShare,
    totalManalShare
  };
}