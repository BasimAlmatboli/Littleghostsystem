import { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Product } from '../../types';
import { getProducts, saveProducts } from '../../services/productService';
import { Loader2, Plus, Search, Package, TrendingUp, Coins, X, PackageSearch } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import { ProductImportExport } from './ProductImportExport';
import { SaveBar } from './SaveBar';
import { ownerOptions, calculateMargin } from '../products/productDisplay';

interface ProductSettingsProps {
  isActive?: boolean;
}

export const ProductSettings = ({ isActive = true }: ProductSettingsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<Product['owner'] | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const hasUnsavedChanges = changedIds.size > 0 || deletedIds.length > 0;
  const changeCount = changedIds.size + deletedIds.length;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setProducts(await getProducts());
    setDeletedIds([]);
    setChangedIds(new Set());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleProductChange = (id: string, field: keyof Product, value: number | string) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
    setChangedIds(new Set(changedIds).add(id));
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
      setDeletedIds([...deletedIds, id]);
      const nextChanged = new Set(changedIds);
      nextChanged.delete(id);
      setChangedIds(nextChanged);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProducts(products, deletedIds);
      setDeletedIds([]);
      setChangedIds(new Set());
      alert('Products saved!');
    } catch {
      alert('Failed to save products. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm('Discard all unsaved product changes?')) {
      loadProducts();
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

  const handleProductAdded = () => {
    setShowAddForm(false);
    loadProducts();
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter(product =>
      (ownerFilter === 'all' || product.owner === ownerFilter) &&
      (!query || product.name.toLowerCase().includes(query))
    );
  }, [products, search, ownerFilter]);

  const stats = useMemo(() => {
    const count = products.length || 1;
    return {
      total: products.length,
      averageMargin: products.reduce((sum, p) => sum + calculateMargin(p.cost, p.sellingPrice), 0) / count,
      averageProfit: products.reduce((sum, p) => sum + (p.sellingPrice - p.cost), 0) / count,
    };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Package className="h-5 w-5" />}
          iconClass="bg-blue-50 text-blue-600"
          label="Products"
          value={isLoading ? '—' : stats.total.toString()}
          hint="In your catalog"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Average margin"
          value={isLoading ? '—' : `${stats.averageMargin.toFixed(0)}%`}
          hint="Markup over cost"
        />
        <StatCard
          icon={<Coins className="h-5 w-5" />}
          iconClass="bg-amber-50 text-amber-600"
          label="Average profit"
          value={isLoading ? '—' : `${stats.averageProfit.toFixed(0)} SAR`}
          hint="Per item, before shipping & fees"
        />
      </div>

      {/* Catalog card */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Product catalog</h2>
            <p className="text-sm text-gray-500">Edit any value inline, then save your changes.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ProductImportExport
              products={products}
              onProductsImported={handleProductsImported}
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Add product</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border-0 bg-gray-50 py-2.5 pl-10 pr-9 text-sm text-gray-900 ring-1 ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={ownerFilter === 'all'} onClick={() => setOwnerFilter('all')}>
              All owners
            </FilterChip>
            {ownerOptions.map(option => (
              <FilterChip
                key={option.value}
                active={ownerFilter === option.value}
                onClick={() => setOwnerFilter(option.value)}
              >
                <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                {option.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
            <Loader2 className="h-7 w-7 animate-spin" />
            <p className="text-sm">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <PackageSearch className="h-6 w-6" />
            </div>
            <p className="font-medium text-gray-900">No products found</p>
            <p className="text-sm text-gray-500">Try a different search or owner filter.</p>
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            changedIds={changedIds}
            onProductChange={handleProductChange}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </div>

      {/* Add product modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowAddForm(false)}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <ProductForm
              nextSortOrder={products.length + 1}
              onProductAdded={handleProductAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      <SaveBar
        visible={isActive && hasUnsavedChanges}
        message={`${changeCount} unsaved product change${changeCount === 1 ? '' : 's'}`}
        saveLabel="Save products"
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};

const StatCard = ({ icon, iconClass, label, value, hint }: {
  icon: ReactNode;
  iconClass: string;
  label: string;
  value: string;
  hint: string;
}) => (
  <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200/70">
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold tracking-tight text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{hint}</p>
    </div>
  </div>
);

const FilterChip = ({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active
        ? 'bg-gray-900 text-white shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
  >
    {children}
  </button>
);
