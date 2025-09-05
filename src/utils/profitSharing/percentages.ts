/**
 * Defines the profit sharing percentages for different products
 */

export const getYassirPercentage = (owner: string): number => {
  // T-shirts are split 50/50 with Ahmed
//   if (owner === 'yassir-ahmed') {
//     return 0.5; // 50%
//   }
  
  // Hoodies are split 50/50 with Manal
  if (owner === 'yassir-manal') {
    return 0.5; // 50%
  }
  
  // Products split 60/40 with Abbas
  if (owner === 'yassir-abbas') {
    return 0.6; // 60%
  }
  
  // For all other products, Yassir gets 100%
  return 1; // 100%
};

export const getAhmedPercentage = (owner: string): number => {
  // Ahmed gets 50% of t-shirts only
  if (owner === 'yassir-ahmed') {
    return 0.5; // 50%
  }
  return 0; // 0% for other products
};

export const getManalPercentage = (owner: string): number => {
  // Manal gets 50% of hoodies only
  if (owner === 'yassir-manal') {
    return 0.5; // 50%
  }
  return 0; // 0% for other products
};

export const getAbbasPercentage = (owner: string): number => {
  // Abbas gets 40% of yassir-abbas products only
  if (owner === 'yassir-abbas') {
    return 0.4; // 40%
  }
  return 0; // 0% for other products
};
