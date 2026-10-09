import { Product } from '../../types';
import { Trash2, ChevronDown } from 'lucide-react';
import {
  ownerOptions,
  getOwnerOption,
  productCategories,
  getProductCategory,
  calculateMargin,
} from '../products/productDisplay';

interface ProductListProps {
  products: Product[];
  changedIds?: Set<string>;
  onProductChange: (id: string, field: keyof Product, value: number | string) => void;
  onDeleteProduct: (id: string) => void;
}

const marginStyle = (margin: number) => {
  if (margin >= 250) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  if (margin >= 150) return 'bg-green-50 text-green-700 ring-green-200';
  if (margin >= 80) return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-red-50 text-red-700 ring-red-200';
};

const inputBase =
  'w-full rounded-lg border-0 bg-transparent py-2 text-sm text-gray-900 ring-1 ring-transparent transition-shadow hover:bg-gray-50 hover:ring-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';

export const ProductList = ({
  products,
  changedIds,
  onProductChange,
  onDeleteProduct,
}: ProductListProps) => {
  const groups = productCategories
    .map(category => ({
      ...category,
      products: products.filter(product => getProductCategory(product.name) === category.id),
    }))
    .filter(group => group.products.length > 0);

  return (
    <div>
      {/* Column headers (desktop) */}
      <div className="hidden grid-cols-12 gap-4 bg-gray-50/80 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 md:grid">
        <div className="col-span-4">Product</div>
        <div className="col-span-2">Cost</div>
        <div className="col-span-2">Selling price</div>
        <div className="col-span-2">Owner</div>
        <div className="col-span-1">Margin</div>
        <div className="col-span-1" />
      </div>

      {groups.map(group => (
        <section key={group.id}>
          <div className="flex items-center gap-2 border-y border-gray-100 bg-white px-5 pb-2 pt-5">
            <span className={`h-2.5 w-2.5 rounded-full ${group.accent}`} />
            <h3 className="text-sm font-semibold text-gray-900">{group.label}</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
              {group.products.length}
            </span>
          </div>

          <ul className="divide-y divide-gray-100">
            {group.products.map(product => {
              const margin = calculateMargin(product.cost, product.sellingPrice);
              const profit = product.sellingPrice - product.cost;
              const owner = getOwnerOption(product.owner);
              const isChanged = changedIds?.has(product.id);

              return (
                <li
                  key={product.id}
                  className={`group relative grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4 transition-colors md:grid-cols-12 md:items-center md:py-2.5 ${isChanged ? 'bg-amber-50/50' : 'hover:bg-gray-50/60'
                    }`}
                >
                  {isChanged && (
                    <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-amber-400" title="Unsaved changes" />
                  )}

                  {/* Name */}
                  <div className="col-span-2 md:col-span-4">
                    <label className="mb-1 block text-xs font-medium text-gray-500 md:hidden">Product</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => onProductChange(product.id, 'name', e.target.value)}
                      className={`${inputBase} px-2.5 font-medium md:-ml-2.5`}
                      aria-label="Product name"
                    />
                  </div>

                  {/* Cost */}
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-500 md:hidden">Cost</label>
                    <MoneyInput
                      value={product.cost}
                      onChange={(value) => onProductChange(product.id, 'cost', value)}
                      ariaLabel={`${product.name} cost`}
                    />
                  </div>

                  {/* Selling price */}
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-500 md:hidden">Selling price</label>
                    <MoneyInput
                      value={product.sellingPrice}
                      onChange={(value) => onProductChange(product.id, 'sellingPrice', value)}
                      ariaLabel={`${product.name} selling price`}
                      emphasized
                    />
                  </div>

                  {/* Owner */}
                  <div className="col-span-2 md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-500 md:hidden">Owner</label>
                    <div className="relative">
                      <span className={`pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${owner.dot}`} />
                      <select
                        value={product.owner}
                        onChange={(e) => onProductChange(product.id, 'owner', e.target.value)}
                        className={`w-full appearance-none rounded-full border-0 py-1.5 pl-7 pr-8 text-xs font-medium ring-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${owner.pill}`}
                        aria-label={`${product.name} owner`}
                      >
                        {ownerOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-60" />
                    </div>
                  </div>

                  {/* Margin */}
                  <div className="flex items-center gap-2 md:col-span-1 md:flex-col md:items-start md:gap-0.5">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${marginStyle(margin)}`}>
                      {margin.toFixed(0)}%
                    </span>
                    <span className="text-[11px] text-gray-400">+{profit.toFixed(0)} SAR</span>
                  </div>

                  {/* Delete */}
                  <div className="flex justify-end md:col-span-1">
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                      aria-label={`Delete ${product.name}`}
                      title="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

const MoneyInput = ({ value, onChange, ariaLabel, emphasized = false }: {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  emphasized?: boolean;
}) => (
  <div className="relative">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      step="0.01"
      min="0"
      aria-label={ariaLabel}
      className={`w-full rounded-lg border-0 bg-gray-50 py-2 pl-2.5 pr-12 text-sm tabular-nums text-gray-900 ring-1 ring-gray-200 transition-shadow hover:ring-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${emphasized ? 'font-semibold' : ''} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
    />
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
      SAR
    </span>
  </div>
);
