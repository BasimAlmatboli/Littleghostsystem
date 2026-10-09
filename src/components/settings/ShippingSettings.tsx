import { useState, useEffect } from 'react';
import { ShippingMethod } from '../../types';
import { getShippingMethods, saveShippingMethods } from '../../data/shipping';
import { Truck, PackageCheck, Info } from 'lucide-react';
import { SaveBar } from './SaveBar';

interface ShippingSettingsProps {
  isActive?: boolean;
}

export const ShippingSettings = ({ isActive = true }: ShippingSettingsProps) => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setShippingMethods(getShippingMethods());
  }, []);

  const handleShippingChange = (id: string, cost: number) => {
    setShippingMethods(methods =>
      methods.map(method =>
        method.id === id ? { ...method, cost } : method
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveShippingMethods(shippingMethods);
    setHasUnsavedChanges(false);
    alert('Shipping settings saved!');
  };

  const handleDiscard = () => {
    setShippingMethods(getShippingMethods());
    setHasUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
        <div className="border-b border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Shipping methods</h2>
          <p className="text-sm text-gray-500">What each delivery option costs your business per order.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          {shippingMethods.map((method) => {
            const isPickup = method.id === 'no-shipping';
            const Icon = isPickup ? PackageCheck : Truck;
            return (
              <div
                key={method.id}
                className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 ring-1 ring-gray-200 transition-shadow focus-within:ring-2 focus-within:ring-blue-500 hover:shadow-sm"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isPickup ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{method.name}</p>
                  <p className="text-xs text-gray-400">{isPickup ? 'Pickup / in person' : 'Courier delivery'}</p>
                </div>
                <div className="relative w-32">
                  <input
                    type="number"
                    value={method.cost}
                    onChange={(e) => handleShippingChange(method.id, Number(e.target.value))}
                    min="0"
                    aria-label={`${method.name} cost`}
                    className="w-full rounded-lg border-0 bg-white py-2 pl-3 pr-12 text-right text-sm font-semibold tabular-nums text-gray-900 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">SAR</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <p>Shipping costs are saved on this device only. Orders with free shipping still count this cost as a business expense.</p>
        </div>
      </div>

      <SaveBar
        visible={isActive && hasUnsavedChanges}
        message="Unsaved shipping changes"
        saveLabel="Save shipping"
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};
