import { OrderItem } from '../types';

interface TotalEarnings {
  yassirProductsCost: number;
  manalProductsCost: number;
  abbasProductsCost: number;
  yassirTotalEarnings: number;
  manalTotalEarnings: number;
  abbasTotalEarnings: number;
  combinedTotalEarnings: number;
}

export const calculateTotalEarnings = (
  items: OrderItem[],
  yassirShare: number,
  manalShare: number,
  abbasShare: number
): TotalEarnings => {
  // Calculate products cost for each owner
  const { yassirCost, manalCost, abbasCost } = items.reduce(
    (acc, item) => {
      const itemTotalCost = item.product.cost * item.quantity;

      // Assign costs based on product ownership
      if (item.product.owner === 'yassir-manal') {
        // Hoodies are co-owned by Yassir and Manal (split costs 50/50)
        acc.yassirCost += itemTotalCost * 0.5;
        acc.manalCost += itemTotalCost * 0.5;
      } else if (item.product.owner === 'yassir-abbas') {
        // Products are co-owned by Yassir and Abbas (split costs 50/50)
        acc.yassirCost += itemTotalCost * 0.5;
        acc.abbasCost += itemTotalCost * 0.5;
      } else {
        // All other products are Yassir's
        acc.yassirCost += itemTotalCost;
      }

      return acc;
    },
    { yassirCost: 0, manalCost: 0, abbasCost: 0 }
  );

  // Calculate total earnings by adding profit share and respective product costs
  const yassirTotalEarnings = yassirShare + yassirCost;
  const manalTotalEarnings = manalShare + manalCost;
  const abbasTotalEarnings = abbasShare + abbasCost;
  const combinedTotalEarnings = yassirTotalEarnings + manalTotalEarnings + abbasTotalEarnings;

  return {
    yassirProductsCost: yassirCost,
    manalProductsCost: manalCost,
    abbasProductsCost: abbasCost,
    yassirTotalEarnings,
    manalTotalEarnings,
    abbasTotalEarnings,
    combinedTotalEarnings,
  };
};
