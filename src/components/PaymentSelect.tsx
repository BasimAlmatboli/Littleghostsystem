import { PaymentMethod } from '../types';
import { CreditCard } from 'lucide-react';

interface PaymentSelectProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const feeHints: Record<PaymentMethod['id'], string> = {
  cash: 'No fees',
  mada: '1% + 1 SAR',
  visa: '2.2% + 1 SAR',
  tamara: '7% + 1.5 SAR',
};

export const PaymentSelect = ({
  selected,
  onSelect,
}: PaymentSelectProps) => {
  const paymentMethods: PaymentMethod[] = [
    { id: 'cash', name: 'Cash' },
    { id: 'mada', name: 'MADA' },
    { id: 'visa', name: 'Visa' },
    { id: 'tamara', name: 'Tamara' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <CreditCard className="h-4 w-4 text-gray-400" />
        Payment
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {paymentMethods.map((method) => {
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
              <span className="block text-xs text-gray-500">{feeHints[method.id]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
