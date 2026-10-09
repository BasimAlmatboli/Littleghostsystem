import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../../types';
import { getProducts, saveProducts } from '../../services/productService';
import { Save, Loader2 } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import { ProductImportExport } from './ProductImportExport';

export const ProductSettings = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setProducts(await getProducts());
    setDeletedIds([]);
    setHasUnsavedChanges(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleProductChange = (id: string, field: keyof Product, value: number | string) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
    setHasUnsavedChanges(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
      setDeletedIds([...deletedIds, id]);
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProducts(products, deletedIds);
      setDeletedIds([]);
      setHasUnsavedChanges(false);
      alert('Products saved!');
    } catch {
      alert('Failed to save products. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProductsImported = async (importedProducts: Product[]) => {
    const updatedProducts = [...products, ...importedProducts];
    try {
      await saveProducts(updatedProducts);
      setProducts(updatedProducts);
      alert('Products imported successfully!');
    } catch {
      alert('Failed to save imported products. Please try again.');
    }
  };

  const saveButton = (
    <button
      onClick={handleSave}
      disabled={isSaving || isLoading}
      className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${hasUnsavedChanges
          ? 'bg-orange-500 hover:bg-orange-600'
          : 'bg-green-600 hover:bg-green-700'
        }`}
    >
      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      <span>{isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Products (unsaved changes)' : 'Save Products'}</span>
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Settings</h2>
        <div className="flex gap-4">
          <ProductImportExport
            products={products}
            onProductsImported={handleProductsImported}
          />
          {saveButton}
        </div>
      </div>

      <ProductForm nextSortOrder={products.length + 1} onProductAdded={loadProducts} />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <ProductList
          products={products}
          onProductChange={handleProductChange}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      <div className="flex justify-end">
        {saveButton}
      </div>
    </div>
  );
};
