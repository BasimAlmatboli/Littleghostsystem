import { Order } from '../types';

export const calculateProfitShare = (
  productName: string,
  netProfit: number
): { yassirShare: number; ahmedShare: number; manalShare: number } => {
  // T-shirts are split 50/50 with Ahmed
  if (productName.includes('T-SHIRT')) {
    return {
      yassirShare: netProfit * 0.5,
      ahmedShare: netProfit * 0.5,
      manalShare: 0
    };
  }
  
  // Hoodies are split 50/50 with Manal
  if (productName.includes('HOODIE')) {
    return {
      yassirShare: netProfit * 0.5,
      ahmedShare: 0,
      manalShare: netProfit * 0.5
    };
  }
  
  // For all other products, Yassir gets 100%
  return {
    yassirShare: netProfit,
    ahmedShare: 0,
    manalShare: 0
  };
};

export const calculateOrderProfitShare = (order: Order) => {
  const totalRevenue = order.items.reduce((sum, item) => 
    sum + (item.product.sellingPrice * item.quantity), 
    0
  );

  let totalYassirShare = 0;
  let totalAhmedShare = 0;
  let totalManalShare = 0;

  order.items.forEach(item => {
    const revenue = item.product.sellingPrice * item.quantity;
    const cost = item.product.cost * item.quantity;
    
    // Calculate this item's proportion of total revenue
    const revenueProportion = revenue / totalRevenue;
    
    // Distribute expenses proportionally based on revenue
    const itemExpenseShare = (order.shippingCost + order.paymentFees) * revenueProportion;
    
    // Calculate net profit
    const itemProfit = revenue - cost - itemExpenseShare;
    
    const shares = calculateProfitShare(item.product.name, itemProfit);
    totalYassirShare += shares.yassirShare;
    totalAhmedShare += shares.ahmedShare;
    totalManalShare += shares.manalShare;
  });

  return {
    yassirShare: totalYassirShare,
    ahmedShare: totalAhmedShare,
    manalShare: totalManalShare
  };
};