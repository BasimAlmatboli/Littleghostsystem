import React, { useState, useEffect } from 'react';
import { OrderItem, Product } from '../types';
import { ProductRow } from './ProductRow';
import { ProductGrid } from './products/ProductGrid';
import { getProducts } from '../data/products';
import { ShoppingCart } from 'lucide-react';

interface ProductSelectProps {
  orderItems: OrderItem[];
  onOrderItemsChange: (items: OrderItem[]) => void;
}

export const ProductSelect: React.FC<ProductSelectProps> = ({
  orderItems,
  onOrderItemsChange,
}) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    setAllProducts(getProducts());
  }, []);

  const handleProductSelect = (product: Product) => {
    const existingItemIndex = orderItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Product already exists, increment quantity
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
      };
      onOrderItemsChange(updatedItems);
    } else {
      // Add new product with quantity 1
      const newItem: OrderItem = {
        product,
        quantity: 1,
      };
      onOrderItemsChange([...orderItems, newItem]);
    }
  };

  const handleItemUpdate = (index: number, updates: { quantity?: number; cost?: number; sellingPrice?: number }) => {
    const updatedItems = [...orderItems];
    
    if (updates.quantity !== undefined) {
      if (updates.quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedItems.splice(index, 1);
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updates.quantity,
        };
      }
    }

    if (updates.cost !== undefined) {
      updatedItems[index] = {
        ...updatedItems[index],
        product: {
          ...updatedItems[index].product,
          cost: updates.cost,
        },
      };
    }

    if (updates.sellingPrice !== undefined) {
      updatedItems[index] = {
        ...updatedItems[index],
        product: {
          ...updatedItems[index].product,
          sellingPrice: updates.sellingPrice,
        },
      };
    }

    onOrderItemsChange(updatedItems);
  };

  // Group and sort products
  const tShirts = allProducts
    .filter(product => product.name.toUpperCase().includes('T-SHIRT'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const shorts = allProducts
    .filter(product => product.name.toUpperCase().includes('SHORT'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const hoodies = allProducts
    .filter(product => product.name.toUpperCase().includes('HOODIE'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const otherProducts = allProducts
    .filter(product => 
      !product.name.toUpperCase().includes('T-SHIRT') &&
      !product.name.toUpperCase().includes('SHORT') &&
      !product.name.toUpperCase().includes('HOODIE')
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectedProducts = orderItems.map(item => item.product);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <ShoppingCart className="h-5 w-5" />
        <span>Products</span>
      </h2>

      {/* Product Selection Grid */}
      <div className="space-y-6">
        {/* T-Shirts */}
        {tShirts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-medium text-gray-700 border-b border-gray-200 pb-2">
              T-Shirts
            </h3>
            <ProductGrid
              products={tShirts}
              selectedProducts={selectedProducts}
              onProductSelect={handleProductSelect}
            />
          </div>
        )}

        {/* Shorts */}
        {shorts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-medium text-gray-700 border-b border-gray-200 pb-2">
              Shorts
            </h3>
            <ProductGrid
              products={shorts}
              selectedProducts={selectedProducts}
              onProductSelect={handleProductSelect}
            />
          </div>
        )}

        {/* Hoodies */}
        {hoodies.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-medium text-gray-700 border-b border-gray-200 pb-2">
              Hoodies
            </h3>
            <ProductGrid
              products={hoodies}
              selectedProducts={selectedProducts}
              onProductSelect={handleProductSelect}
            />
          </div>
        )}

        {/* Other Products */}
        {otherProducts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-medium text-gray-700 border-b border-gray-200 pb-2">
              Other Products
            </h3>
            <ProductGrid
              products={otherProducts}
              selectedProducts={selectedProducts}
              onProductSelect={handleProductSelect}
            />
          </div>
        )}

        {allProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No products available. Please add products in Settings.</p>
          </div>
        )}
      </div>

      {/* Selected Products */}
      {orderItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700 border-b border-gray-200 pb-2">
            Selected Products
          </h3>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <ProductRow
                key={`${item.product.id}-${index}`}
                item={item}
                onItemUpdate={(updates) => handleItemUpdate(index, updates)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};