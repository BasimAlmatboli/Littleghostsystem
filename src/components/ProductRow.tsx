import React from 'react';
import { Trash2 } from 'lucide-react';
import { OrderItem } from '../types';

interface ProductRowProps {
  item: OrderItem;
  onItemUpdate: (updates: { quantity?: number; cost?: number; sellingPrice?: number }) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  item,
  onItemUpdate,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm text-gray-600">
            Total: {(item.product.sellingPrice * item.quantity).toFixed(2)} SAR
          </p>
        </div>
        
        <button
          onClick={() => onItemUpdate({ quantity: 0 })}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove product"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      
      {/* Editable Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min="0"
            value={item.quantity}
            onChange={(e) => onItemUpdate({ quantity: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost (SAR)
          </label>
          <input
            type="number"
            value={item.product.cost}
            onChange={(e) => onItemUpdate({ cost: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price (SAR)
          </label>
          <input
            type="number"
            value={item.product.sellingPrice}
            onChange={(e) => onItemUpdate({ sellingPrice: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
            min="0"
          />
        </div>
      </div>
      
      {/* Profit Calculation */}
      <div className="bg-gray-50 rounded-md p-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Profit per unit:</span>
            <span className="ml-2 font-medium text-green-600">
              {(item.product.sellingPrice - item.product.cost).toFixed(2)} SAR
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total profit:</span>
            <span className="ml-2 font-medium text-green-600">
              {((item.product.sellingPrice - item.product.cost) * item.quantity).toFixed(2)} SAR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};