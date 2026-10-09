import { ShippingMethod } from '../types';
import { getShippingMethods } from '../data/shipping';
import { Truck } from 'lucide-react';

interface ShippingSelectProps {
  selected: ShippingMethod | null;
  onSelect: (method: ShippingMethod) => void;
  onShippingMethodCostChange: (cost: number) => void;
  isFreeShipping: boolean;
  onFreeShippingChange: (value: boolean) => void;
}

export const ShippingSelect = ({
  selected,
  onSelect,
  onShippingMethodCostChange,
  isFreeShipping,
  onFreeShippingChange,
}: ShippingSelectProps) => {
  const shippingMethods = getShippingMethods();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Truck className="h-4 w-4 text-gray-400" />
          Shipping
        </h3>
        <label className="flex cursor-pointer items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Free for customer</span>
          <span className="relative inline-flex">
            <input
              type="checkbox"
              checked={isFreeShipping}
              onChange={(e) => onFreeShippingChange(e.target.checked)}
              className="peer sr-only"
            />
            <span className="h-5 w-9 rounded-full bg-gray-200 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2" />
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {shippingMethods.map((method) => {
          const isSelected = selected?.id === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method)}
              aria-pressed={isSelected}
              className={`rounded-xl px-3 py-2.5 text-left ring-1 transition-all ${isSelected
                  ? 'bg-blue-50 ring-2 ring-blue-500'
                  : 'bg-white ring-gray-200 hover:bg-gray-50'
                }`}
            >
              <span className={`block text-sm font-medium ${isSelected ? 'text-blue-800' : 'text-gray-900'}`}>{method.name}</span>
              <span className="block text-xs text-gray-500">
                {isFreeShipping && method.cost > 0 ? (
                  <>
                    <span className="line-through">{method.cost} SAR</span>{' '}
                    <span className="font-medium text-emerald-600">Free</span>
                  </>
                ) : (
                  `${method.cost} SAR`
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Manual Cost Override */}
      {selected && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 px-3.5 py-2.5">
          <label htmlFor="shippingCostOverride" className="text-xs font-medium text-gray-600">
            Shipping cost for this order
          </label>
          <div className="relative w-28">
            <input
              id="shippingCostOverride"
              type="number"
              value={selected.cost}
              onChange={(e) => onShippingMethodCostChange(Number(e.target.value) || 0)}
              disabled={isFreeShipping}
              className="w-full rounded-lg border-0 bg-white py-1.5 pl-2.5 pr-10 text-right text-sm font-semibold tabular-nums ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              step="0.01"
              min="0"
            />
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400">SAR</span>
          </div>
        </div>
      )}
    </div>
  );
};
