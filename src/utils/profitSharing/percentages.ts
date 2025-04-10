/**
 * Defines the profit sharing percentages for different products
 */

export const getYassirPercentage = (productName: string): number => {
  // T-shirts are split 50/50 with Ahmed
  if (productName.includes('T-SHIRT')) {
    return 0.5; // 50%
  }
  
  // Hoodies are split 50/50 with Manal
  if (productName.includes('HOODIE')) {
    return 0.5; // 50%
  }
  
  // For all other products, Yassir gets 100%
  return 1; // 100%
};

export const getAhmedPercentage = (productName: string): number => {
  // Ahmed gets 50% of t-shirts only
  if (productName.includes('T-SHIRT')) {
    return 0.5; // 50%
  }
  return 0; // 0% for other products
};

export const getManalPercentage = (productName: string): number => {
  // Manal gets 50% of hoodies only
  if (productName.includes('HOODIE')) {
    return 0.5; // 50%
  }
  return 0; // 0% for other products
};