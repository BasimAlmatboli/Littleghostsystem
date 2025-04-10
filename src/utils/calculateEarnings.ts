import { OrderItem } from '../types';

interface TotalEarnings {
  yassirProductsCost: number;
  ahmedProductsCost: number;
  manalProductsCost: number;
  yassirTotalEarnings: number;
  ahmedTotalEarnings: number;
  manalTotalEarnings: number;
  combinedTotalEarnings: number;
}

export const calculateTotalEarnings = (
  items: OrderItem[],
  yassirShare: number,
  ahmedShare: number,
  manalShare: number
): TotalEarnings => {
  // Calculate products cost for each owner
  const { yassirCost, ahmedCost, manalCost } = items.reduce(
    (acc, item) => {
      const itemTotalCost = item.product.cost * item.quantity;
      
      // Assign costs based on product ownership
      if (item.product.owner === 'yassir-ahmed') {
        // T-shirts are co-owned by Yassir and Ahmed (split costs 50/50)
        acc.yassirCost += itemTotalCost * 0.5;
        acc.ahmedCost += itemTotalCost * 0.5;
      } else if (item.product.owner === 'yassir-manal') {
        // Hoodies are co-owned by Yassir and Manal (split costs 50/50)
        acc.yassirCost += itemTotalCost * 0.5;
        acc.manalCost += itemTotalCost * 0.5;
      } else {
        // All other products are Yassir's
        acc.yassirCost += itemTotalCost;
      }
      
      return acc;
    },
    { yassirCost: 0, ahmedCost: 0, manalCost: 0 }
  );

  // Calculate total earnings by adding profit share and respective product costs
  const yassirTotalEarnings = yassirShare + yassirCost;
  const ahmedTotalEarnings = ahmedShare + ahmedCost;
  const manalTotalEarnings = manalShare + manalCost;
  const combinedTotalEarnings = yassirTotalEarnings + ahmedTotalEarnings + manalTotalEarnings;

  return {
    yassirProductsCost: yassirCost,
    ahmedProductsCost: ahmedCost,
    manalProductsCost: manalCost,
    yassirTotalEarnings,
    ahmedTotalEarnings,
    manalTotalEarnings,
    combinedTotalEarnings,
  };
};