import React, { useState } from 'react';
import { Product } from '../../types';
import { addProduct } from '../../services/productService';
import { Plus, X, Loader2, PackagePlus, Check } from 'lucide-react';
import { ownerOptions, calculateMargin } from '../products/productDisplay';

interface ProductFormProps {
  nextSortOrder: number;
  onProductAdded: () => void;
  onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ nextSortOrder, onProductAdded, onCancel }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [owner, setOwner] = useState<'yassir' | 'yassir-ahmed' | 'yassir-manal' | 'yassir-abbas'>('yassir');

  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !cost || !sellingPrice) {
      alert('Please fill in all fields');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      cost: Number(cost),
      sellingPrice: Number(sellingPrice),
      owner
    };

    setIsAdding(true);
    try {
      await addProduct(newProduct, nextSortOrder);
    } catch {
      alert('Failed to add product. Please try again.');
      return;
    } finally {
      setIsAdding(false);
    }

    // Reset form
    setName('');
    setCost('');
    setSellingPrice('');
    setOwner('yassir');

    onProductAdded();
  };

  const hasPrices = cost !== '' && sellingPrice !== '';
  const previewProfit = Number(sellingPrice) - Number(cost);
  const previewMargin = calculateMargin(Number(cost), Number(sellingPrice));

  const fieldClass =
    'mt-1.5 block w-full rounded-xl border-0 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 ring-1 ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <PackagePlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Add new product</h3>
            <p className="text-sm text-gray-500">It will appear on Events and Calculator right away.</p>
          </div>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="e.g. SEAM T-SHIRT"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Cost
            </label>
            <div className="relative">
              <input
                type="number"
                id="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className={`${fieldClass} pr-12`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 mt-[3px] -translate-y-1/2 text-xs font-medium text-gray-400">SAR</span>
            </div>
          </div>

          <div>
            <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">
              Selling price
            </label>
            <div className="relative">
              <input
                type="number"
                id="sellingPrice"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className={`${fieldClass} pr-12`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 mt-[3px] -translate-y-1/2 text-xs font-medium text-gray-400">SAR</span>
            </div>
          </div>
        </div>

        {hasPrices && (
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 text-sm ring-1 ring-emerald-100">
            <span className="text-emerald-800">Profit per item</span>
            <span className="font-semibold text-emerald-700">
              {previewProfit.toFixed(2)} SAR · {previewMargin.toFixed(0)}%
            </span>
          </div>
        )}

        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">Product owner</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {ownerOptions.map(option => {
              const isSelected = owner === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setOwner(option.value)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium ring-1 transition-all ${isSelected
                      ? 'bg-blue-50 text-blue-800 ring-2 ring-blue-500'
                      : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${option.dot}`} />
                  <span className="flex-1">{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex justify-end gap-2 pt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isAdding}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:shadow-lg disabled:opacity-60"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>{isAdding ? 'Adding...' : 'Add product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
