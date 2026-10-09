import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Product } from '../../types';
import { exportProductsToCSV, importProductsFromCSV, downloadCSV } from '../../utils/productCsvHelpers';

interface ProductImportExportProps {
  products: Product[];
  onProductsImported: (products: Product[]) => void;
}

export const ProductImportExport: React.FC<ProductImportExportProps> = ({
  products,
  onProductsImported,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const csv = exportProductsToCSV(products);
    const filename = `products-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedProducts = await importProductsFromCSV(file);
      onProductsImported(importedProducts);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing products:', error);
      alert('Error importing products. Please check the file format and try again.');
    }
  };

  const secondaryButton =
    'flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 transition-colors hover:bg-gray-50 hover:text-gray-900';

  return (
    <div className="flex gap-2">
      <button onClick={handleExport} className={secondaryButton} title="Download products as CSV">
        <Download className="h-4 w-4 text-gray-500" />
        <span>Export</span>
      </button>

      <label className={`${secondaryButton} cursor-pointer`} title="Add products from a CSV file">
        <Upload className="h-4 w-4 text-gray-500" />
        <span>Import</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
};