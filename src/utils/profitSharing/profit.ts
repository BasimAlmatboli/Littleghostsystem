import { OrderItem } from '../../types';
import { ProfitShare, ItemProfitDetails, TotalProfitShare } from './types';
import { getYassirPercentage, getAhmedPercentage, getManalPercentage, getAbbasPercentage } from './percentages';
import { 
  calculateItemRevenue, 
  calculateTotalRevenue,
  calculateRevenueProportion 
} from './revenue';
import { 
  calculateItemExpenseShare,
  calculateItemCost 
} from './expenses';

export const calculateItemProfit = (
  item: OrderItem,
  totalSubtotal: number,
  shippingCost: number,
  paymentFees: number,
  discountAmount: number,
  isFreeShipping: boolean
): ItemProfitDetails => {
  const itemSubtotal = item.product.sellingPrice * item.quantity;
  const revenueProportion = calculateRevenueProportion(itemSubtotal, totalSubtotal);
  
  // Calculate total (only add shipping if it's not free)
  const shippingToAdd = isFreeShipping ? 0 : shippingCost;
  const total = itemSubtotal + (shippingToAdd * revenueProportion);
  
  // Calculate cost
  const cost = calculateItemCost(item.product.cost, item.quantity);
  
  // Calculate expense share (always include shipping cost in expenses even if free)
  const totalExpenses = shippingCost + paymentFees + discountAmount;
  const expenseShare = calculateItemExpenseShare(totalExpenses, revenueProportion);
  
  // Calculate net profit
  const netProfit = total - cost - expenseShare;
  
  // Calculate shares
  const yassirShare = netProfit * getYassirPercentage(item.product.owner);
  const ahmedShare = netProfit * getAhmedPercentage(item.product.owner);
  const manalShare = netProfit * getManalPercentage(item.product.owner);
  const abbasShare = netProfit * getAbbasPercentage(item.product.owner);
  
  return {
    total,
    revenueProportion,
    expenseShare,
    cost,
    netProfit,
    yassirShare,
    ahmedShare,
    manalShare,
    abbasShare,
  };
};

export const calculateTotalProfitShare = (
  items: OrderItem[],
  shippingCost: number,
  paymentFees: number,
  discountAmount: number,
  isFreeShipping: boolean = false
): TotalProfitShare => {
  const totalSubtotal = items.reduce(
    (sum, item) => sum + (item.product.sellingPrice * item.quantity),
    0
  );
  
  // Only add shipping to total if it's not free
  const totalWithShipping = totalSubtotal + (isFreeShipping ? 0 : shippingCost);
  
  const itemShares = items.map(item => 
    calculateItemProfit(
      item,
      totalSubtotal,
      shippingCost,
      paymentFees,
      discountAmount,
      isFreeShipping
    )
  );
  
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
  
  const totalAbbasShare = itemShares.reduce(
    (sum, share) => sum + share.abbasShare,
    0
  );
  
  return {
    totalWithShipping,
    itemShares,
    totalYassirShare,
    totalAhmedShare,
    totalManalShare,
    totalAbbasShare,
  };
};