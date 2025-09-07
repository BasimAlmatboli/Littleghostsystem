import React from 'react';
import { ShippingMethod } from '../types';
import { getShippingMethods } from '../data/shipping';

interface ShippingSelectProps {
  selected: ShippingMethod | null;
  onSelect: (method: ShippingMethod) => void;
  onShippingMethodCostChange: (cost: number) => void;
  isFreeShipping: boolean;
  onFreeShippingChange: (value: boolean) => void;
}

export const ShippingSelect: React.FC<ShippingSelectProps> = ({
  selected,
  onSelect,
  onShippingMethodCostChange,
  isFreeShipping,
  onFreeShippingChange,
}) => {
  const shippingMethods = getShippingMethods();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Shipping Method</h2>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFreeShipping}
            onChange={(e) => onFreeShippingChange(e.target.checked)}
            className="rounded text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Offer Free Shipping</span>
        </label>
      </div>
      <div className="space-y-2">
        {shippingMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center justify-between p-4 bg-white rounded-lg shadow cursor-pointer ${
              selected?.id === method.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center flex-1">
              <input
                type="radio"
                name="shipping"
                checked={selected?.id === method.id}
                onChange={() => onSelect(method)}
                className="mr-3"
              />
              <span>{method.name}</span>
            </div>
            <div className="text-right">
              {isFreeShipping ? (
                <div className="flex flex-col items-end">
                  <span className="text-green-600 font-medium">Free</span>
                  <span className="text-sm text-gray-400 line-through">
                    {method.cost} SAR
                  </span>
                </div>
              ) : (
                <span className="text-gray-600">{method.cost} SAR</span>
              )}
            </div>
          </label>
        ))}
      </div>
      
      {/* Manual Cost Override */}
      {selected && (
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Customize Shipping Cost (This Order Only)
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-blue-700 mb-1">
                Shipping Cost (SAR)
              </label>
              <input
                type="number"
                value={selected.cost}
                onChange={(e) => onShippingMethodCostChange(Number(e.target.value) || 0)}
                disabled={isFreeShipping}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isFreeShipping ? 'bg-gray-100 text-gray-500' : 'bg-white'
                }`}
                step="0.01"
                min="0"
              />
            </div>
            <div className="text-sm text-blue-600">
              {isFreeShipping ? (
                <span className="text-green-600 font-medium">Free shipping applied</span>
              ) : (
                <span>Customer pays: {selected.cost} SAR</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};