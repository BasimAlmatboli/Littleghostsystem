import { useState, useEffect, useMemo, ReactNode } from 'react';
import { OrderItem, Product } from '../types';
import { getProducts } from '../services/productService';
import { ShoppingBag, Search, X, Loader2 } from 'lucide-react';
import { productCategories, getProductCategory, getOwnerOption, ProductCategoryId } from './products/productDisplay';

interface ProductSelectProps {
  orderItems: OrderItem[];
  onOrderItemsChange: (items: OrderItem[]) => void;
}

export const ProductSelect = ({
  orderItems,
  onOrderItemsChange,
}: ProductSelectProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategoryId | 'all'>('all');

  useEffect(() => {
    getProducts().then(products => {
      setAllProducts(products);
      setIsLoading(false);
    });
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

  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return productCategories
      .map(cat => ({
        ...cat,
        products: allProducts
          .filter(product => getProductCategory(product.name) === cat.id)
          .filter(product => !query || product.name.toLowerCase().includes(query))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .filter(group => group.products.length > 0);
  }, [allProducts, search]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ProductCategoryId, number>> = {};
    allProducts.forEach(product => {
      const id = getProductCategory(product.name);
      counts[id] = (counts[id] ?? 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const visibleGroups = category === 'all' ? groups : groups.filter(group => group.id === category);
  const quantityFor = (productId: string) =>
    orderItems.find(item => item.product.id === productId)?.quantity ?? 0;

  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
      {/* Header + search */}
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <ShoppingBag className="h-5 w-5 text-blue-600" />
          Products
        </h2>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border-0 bg-gray-50 py-2 pl-9 pr-8 text-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 px-4 py-3 [scrollbar-width:none]">
        <CategoryChip active={category === 'all'} onClick={() => setCategory('all')}>
          All <span className="opacity-60">{allProducts.length}</span>
        </CategoryChip>
        {productCategories
          .filter(cat => categoryCounts[cat.id])
          .map(cat => (
            <CategoryChip key={cat.id} active={category === cat.id} onClick={() => setCategory(cat.id)}>
              <span className={`h-2 w-2 rounded-full ${cat.accent}`} />
              {cat.label} <span className="opacity-60">{categoryCounts[cat.id]}</span>
            </CategoryChip>
          ))}
      </div>

      {/* Product tiles */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading products...
          </div>
        ) : visibleGroups.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            {allProducts.length === 0
              ? 'No products available. Please add products in Settings.'
              : 'No products match your search.'}
          </div>
        ) : (
          // Small categories (1-2 products) sit side by side to save vertical space
          <div className="grid grid-flow-row-dense grid-cols-1 gap-3 sm:grid-cols-2">
            {visibleGroups.map(group => {
              const inOrder = group.products.reduce((sum, product) => sum + quantityFor(product.id), 0);
              const isCompact = group.products.length <= 2;
              return (
                <div key={group.id} className={`rounded-2xl p-3 ring-1 ${group.panel} ${isCompact ? '' : 'sm:col-span-2'}`}>
                  {/* Category header */}
                  <div className="mb-2.5 flex items-center gap-2 px-0.5">
                    <span className={`h-4 w-1 rounded-full ${group.accent}`} />
                    <h3 className={`text-sm font-semibold ${group.title}`}>{group.label}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${group.badge}`}>
                      {group.products.length}
                    </span>
                    {inOrder > 0 && (
                      <span className="ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                        {inOrder} in order
                      </span>
                    )}
                  </div>

                  <div className={`grid gap-2 ${isCompact ? 'grid-cols-3 sm:grid-cols-2' : 'grid-cols-3 sm:grid-cols-4 xl:grid-cols-5'}`}>
                    {group.products.map(product => {
                      const quantity = quantityFor(product.id);
                      const owner = getOwnerOption(product.owner);
                      return (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          title={`${product.name} · ${owner.label}`}
                          className={`relative flex min-h-[64px] flex-col justify-between rounded-xl px-2.5 py-2.5 text-left shadow-sm ring-1 transition-all active:scale-[0.97] ${quantity > 0
                              ? 'bg-blue-50 ring-2 ring-blue-500'
                              : 'bg-white ring-black/5 hover:-translate-y-px hover:shadow-md'
                            }`}
                        >
                          <span className={`line-clamp-2 text-[11px] font-semibold leading-snug text-gray-900 sm:text-xs ${quantity > 0 ? 'pr-6' : ''}`}>
                            {product.name}
                          </span>
                          <span className="mt-1 flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${owner.dot}`} />
                            <span className="text-sm font-bold text-gray-900">{product.sellingPrice}</span>
                            <span className="text-[10px] text-gray-400">SAR</span>
                          </span>
                          {quantity > 0 && (
                            <span className="absolute right-1.5 top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white shadow">
                              {quantity}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const CategoryChip = ({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
  >
    {children}
  </button>
);
