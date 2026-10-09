import React, { useState } from 'react';
import { Product } from '../../types';
import { addProduct } from '../../services/productService';
import { Plus } from 'lucide-react';

interface ProductFormProps {
  nextSortOrder: number;
  onProductAdded: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ nextSortOrder, onProductAdded }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter product name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Cost (SAR)
            </label>
            <input
              type="number"
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">
              Selling Price (SAR)
            </label>
            <input
              type="number"
              id="sellingPrice"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
            Product Owner
          </label>
          <select
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value as 'yassir' | 'yassir-ahmed' | 'yassir-manal' | 'yassir-abbas')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="yassir">Yassir</option>
            <option value="yassir-ahmed">Yassir & Ahmed (T-shirts)</option>
            <option value="yassir-manal">Yassir & Manal (Hoodies)</option>
            <option value="yassir-abbas">Yassir & Abbas</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? 'Adding...' : 'Add Product'}</span>
        </button>
      </form>
    </div>
  );
};