import React from 'react';
import { Order } from '../../types';
import { calculateTotalEarnings } from '../../utils/calculateEarnings';
import { calculateTotalProfitShare } from '../../utils/profitSharing';
import { Wallet } from 'lucide-react';

interface TotalEarningsReportProps {
  orders: Order[];
}

export const TotalEarningsReport: React.FC<TotalEarningsReportProps> = ({ orders }) => {
  // Calculate total earnings across all orders
  const totalEarningsData = orders.reduce((acc, order) => {
    const discountAmount = order.discount
      ? order.discount.type === 'percentage'
        ? (order.subtotal * order.discount.value) / 100
        : order.discount.value
      : 0;

    const profitSharing = calculateTotalProfitShare(
      order.items,
      order.shippingCost,
      order.paymentFees,
      discountAmount,
      order.isFreeShipping
    );

    const earnings = calculateTotalEarnings(
      order.items,
      profitSharing.totalYassirShare,
      profitSharing.totalAhmedShare,
      profitSharing.totalManalShare,
      profitSharing.totalAbbasShare
    );

    return {
      yassirProductsCost: acc.yassirProductsCost + earnings.yassirProductsCost,
      ahmedProductsCost: acc.ahmedProductsCost + earnings.ahmedProductsCost,
      manalProductsCost: acc.manalProductsCost + earnings.manalProductsCost,
      abbasProductsCost: acc.abbasProductsCost + earnings.abbasProductsCost,
      yassirTotalEarnings: acc.yassirTotalEarnings + earnings.yassirTotalEarnings,
      ahmedTotalEarnings: acc.ahmedTotalEarnings + earnings.ahmedTotalEarnings,
      manalTotalEarnings: acc.manalTotalEarnings + earnings.manalTotalEarnings,
      abbasTotalEarnings: acc.abbasTotalEarnings + earnings.abbasTotalEarnings,
      combinedTotalEarnings: acc.combinedTotalEarnings + earnings.combinedTotalEarnings,
    };
  }, {
    yassirProductsCost: 0,
    ahmedProductsCost: 0,
    manalProductsCost: 0,
    abbasProductsCost: 0,
    yassirTotalEarnings: 0,
    ahmedTotalEarnings: 0,
    manalTotalEarnings: 0,
    abbasTotalEarnings: 0,
    combinedTotalEarnings: 0,
  });

  if (!orders?.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Total Earnings Report</h2>
        </div>
        <p className="text-gray-500">No orders found to generate earnings report.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Total Earnings Report</h2>
      </div>

      <div className="space-y-6">
        {/* Yassir's Earnings */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-indigo-800 mb-4">Yassir's Total Earnings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-indigo-600">Products Cost:</span>
              <span className="ml-2 font-medium">{totalEarningsData.yassirProductsCost.toFixed(2)} SAR</span>
            </div>
            <div>
              <span className="text-indigo-600">Total Earnings:</span>
              <span className="ml-2 font-medium">{totalEarningsData.yassirTotalEarnings.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>

        {/* Ahmed's Earnings */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-800 mb-4">Ahmed's Total Earnings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-green-600">Products Cost:</span>
              <span className="ml-2 font-medium">{totalEarningsData.ahmedProductsCost.toFixed(2)} SAR</span>
            </div>
            <div>
              <span className="text-green-600">Total Earnings:</span>
              <span className="ml-2 font-medium">{totalEarningsData.ahmedTotalEarnings.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>

        {/* Manal's Earnings */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-purple-800 mb-4">Manal's Total Earnings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-purple-600">Products Cost:</span>
              <span className="ml-2 font-medium">{totalEarningsData.manalProductsCost.toFixed(2)} SAR</span>
            </div>
            <div>
              <span className="text-purple-600">Total Earnings:</span>
              <span className="ml-2 font-medium">{totalEarningsData.manalTotalEarnings.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>

        {/* Abbas's Earnings */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-orange-800 mb-4">Abbas's Total Earnings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-orange-600">Products Cost:</span>
              <span className="ml-2 font-medium">{totalEarningsData.abbasProductsCost.toFixed(2)} SAR</span>
            </div>
            <div>
              <span className="text-orange-600">Total Earnings:</span>
              <span className="ml-2 font-medium">{totalEarningsData.abbasTotalEarnings.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>

        {/* Combined Total */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-4">Combined Total Earnings</h3>
          <div className="text-2xl font-bold text-blue-700">
            {totalEarningsData.combinedTotalEarnings.toFixed(2)} SAR
          </div>
        </div>

        {/* Order Count */}
        <div className="text-sm text-gray-600">
          Based on {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};