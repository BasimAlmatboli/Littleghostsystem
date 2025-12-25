import React from 'react';
import { Order } from '../../types';
import { CheckCircle, X } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order;
  onNewOrder: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onNewOrder,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-green-50 border-b border-green-200 p-6 flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-green-800">Order Saved!</h2>
            <p className="text-sm text-green-700">Successfully saved order #{order.orderNumber}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Order Number:</span>
              <span className="text-xl font-bold text-gray-900">#{order.orderNumber}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Items:</span>
              <span className="font-semibold text-gray-900">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Total:</span>
              <span className="text-2xl font-bold text-green-600">{order.total.toFixed(2)} SAR</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Net Profit:</span>
              <span className="text-xl font-bold text-blue-600">{order.netProfit.toFixed(2)} SAR</span>
            </div>
          </div>

          {/* Quick Item Details */}
          <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
            <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
            <div className="space-y-1">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.product.name}</span>
                  <span className="font-medium">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <button
            onClick={onNewOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
};
