import React from 'react';
import { OrderItem } from '../types';
import { calculateTotalEarnings } from '../utils/calculateEarnings';
import { Wallet } from 'lucide-react';

interface EarningsReportProps {
  items: OrderItem[];
  totalYassirShare: number;
  totalAhmedShare: number;
  totalManalShare: number;
}

export const EarningsReport: React.FC<EarningsReportProps> = ({
  items,
  totalYassirShare,
  totalAhmedShare,
  totalManalShare,
}) => {
  const earnings = calculateTotalEarnings(items, totalYassirShare, totalAhmedShare, totalManalShare);

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <Wallet className="h-5 w-5" />
        <span>Total Earnings Report</span>
      </h3>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 space-y-6">
        {/* Yassir's Earnings */}
        <div className="space-y-2">
          <h4 className="text-indigo-800 font-medium">Yassir's Total Earnings</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-indigo-600">Profit Share:</span>
              <span className="ml-2 font-medium">{totalYassirShare.toFixed(2)} SAR</span>
            </div>
            <div>
              <span className="text-indigo-600">Products Cost:</span>
              <span className="ml-2 font-medium">{earnings.yassirProductsCost.toFixed(2)} SAR</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-indigo-100">
            <span className="text-lg font-bold text-indigo-800">
              Total: {earnings.yassirTotalEarnings.toFixed(2)} SAR
            </span>
          </div>
        </div>

        {/* Ahmed's Earnings */}
        <div className="space-y-2">
          <h4 className="text-green-800 font-medium">Ahmed's Total Earnings</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-600">Profit Share:</span>
              <span className="ml-2 font-medium">{totalAhmedShare.toFixed(2)} SAR</span>
            </div>
            <div>
              <span className="text-green-600">Products Cost:</span>
              <span className="ml-2 font-medium">{earnings.ahmedProductsCost.toFixed(2)} SAR</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-green-100">
            <span className="text-lg font-bold text-green-800">
              Total: {earnings.ahmedTotalEarnings.toFixed(2)} SAR
            </span>
          </div>
        </div>

        {/* Manal's Earnings */}
        <div className="space-y-2">
          <h4 className="text-purple-800 font-medium">Manal's Total Earnings</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-600">Profit Share:</span>
              <span className="ml-2 font-medium">{totalManalShare.toFixed(2)} SAR</span>
            </div>
            <div>
              <span className="text-purple-600">Products Cost:</span>
              <span className="ml-2 font-medium">{earnings.manalProductsCost.toFixed(2)} SAR</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-100">
            <span className="text-lg font-bold text-purple-800">
              Total: {earnings.manalTotalEarnings.toFixed(2)} SAR
            </span>
          </div>
        </div>

        {/* Combined Earnings */}
        <div className="pt-4 border-t border-indigo-200">
          <div className="text-xl font-bold text-gray-800">
            Combined Total Earnings: {earnings.combinedTotalEarnings.toFixed(2)} SAR
          </div>
        </div>
      </div>
    </div>
  );
};