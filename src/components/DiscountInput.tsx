import React, { useState } from 'react';
import { Discount } from '../types';
import { Tag, X, SlidersHorizontal } from 'lucide-react';

interface DiscountInputProps {
  onApplyDiscount: (discount: Discount | null) => void;
  activeDiscount?: Discount | null;
}

const PREDEFINED_DISCOUNTS: Discount[] = [
  { type: 'percentage', value: 10 },
  { type: 'percentage', value: 15 },
  { type: 'percentage', value: 20 },
  { type: 'fixed', value: 39.5 },
  { type: 'fixed', value: 79 },
];

const formatDiscount = (discount: Discount) =>
  discount.type === 'percentage' ? `${discount.value}%` : `${discount.value} SAR`;

export const DiscountInput: React.FC<DiscountInputProps> = ({ onApplyDiscount, activeDiscount = null }) => {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleApplyDiscount = () => {
    if (!discountValue) {
      onApplyDiscount(null);
      return;
    }

    const value = Number(discountValue);
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid discount value');
      return;
    }

    if (discountType === 'percentage' && value > 100) {
      alert('Percentage discount cannot exceed 100%');
      return;
    }

    onApplyDiscount({
      type: discountType,
      value,
      code: discountCode.trim() || undefined,
    });
  };

  const handleClearDiscount = () => {
    setDiscountValue('');
    setDiscountCode('');
    onApplyDiscount(null);
  };

  const handlePredefinedDiscount = (discount: Discount) => {
    setDiscountType(discount.type);
    setDiscountValue(discount.value.toString());
    setDiscountCode('');
    onApplyDiscount(discount);
  };

  const isActive = (discount: Discount) =>
    !!activeDiscount && activeDiscount.type === discount.type && activeDiscount.value === discount.value && !activeDiscount.code;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Tag className="h-4 w-4 text-gray-400" />
          Discount
        </h3>
        {activeDiscount && (
          <button
            onClick={handleClearDiscount}
            className="flex items-center gap-1 rounded-full bg-emerald-50 py-1 pl-2.5 pr-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-100"
            title="Remove discount"
          >
            {formatDiscount(activeDiscount)}{activeDiscount.code ? ` · ${activeDiscount.code}` : ''} applied
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {PREDEFINED_DISCOUNTS.map((discount, index) => (
          <button
            key={index}
            onClick={() => handlePredefinedDiscount(discount)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${isActive(discount)
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {formatDiscount(discount)}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-colors ${showCustom ? 'bg-blue-50 text-blue-700 ring-blue-200' : 'bg-white text-gray-600 ring-gray-200 hover:bg-gray-50'
            }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Custom
        </button>
      </div>

      {showCustom && (
        <div className="space-y-3 rounded-xl bg-gray-50 p-3.5">
          <div className="inline-flex rounded-lg bg-white p-0.5 ring-1 ring-gray-200">
            {(['percentage', 'fixed'] as const).map(type => (
              <button
                key={type}
                onClick={() => setDiscountType(type)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${discountType === type ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {type === 'percentage' ? 'Percentage (%)' : 'Fixed (SAR)'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full rounded-lg border-0 bg-white py-2 pl-3 pr-10 text-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={discountType === 'percentage' ? '10' : '50'}
                min="0"
                step={discountType === 'percentage' ? '1' : '0.01'}
                aria-label={discountType === 'percentage' ? 'Discount percentage' : 'Discount amount'}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {discountType === 'percentage' ? '%' : 'SAR'}
              </span>
            </div>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full rounded-lg border-0 bg-white px-3 py-2 text-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Code (optional)"
              aria-label="Discount code"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApplyDiscount}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Apply discount
            </button>
            <button
              onClick={handleClearDiscount}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
