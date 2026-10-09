import { useState, ReactNode } from 'react';
import { Order, OrderItem } from '../../types';
import { Minus, Plus, Trash2, Save, Loader2, ShoppingCart, Pencil, Info } from 'lucide-react';
import { getOwnerOption } from '../products/productDisplay';

interface OrderCartProps {
  orderItems: OrderItem[];
  onOrderItemsChange: (items: OrderItem[]) => void;
  order: Order | null;
  orderNumber: string;
  isSaving: boolean;
  saveLabel: string;
  onSave: () => void;
}

export const OrderCart = ({
  orderItems,
  onOrderItemsChange,
  order,
  orderNumber,
  isSaving,
  saveLabel,
  onSave,
}: OrderCartProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleItemUpdate = (index: number, updates: { quantity?: number; cost?: number; sellingPrice?: number }) => {
    const updatedItems = [...orderItems];

    if (updates.quantity !== undefined) {
      if (updates.quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedItems.splice(index, 1);
        setEditingIndex(null);
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

  const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = orderItems.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);

  const discountAmount = order?.discount
    ? order.discount.type === 'percentage'
      ? (order.subtotal * order.discount.value) / 100
      : order.discount.value
    : 0;

  return (
    <section className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Order {orderNumber ? <span className="text-gray-400">#{orderNumber}</span> : null}
          </h2>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </span>
      </div>

      {/* Items */}
      {orderItems.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-gray-900">No products yet</p>
          <p className="text-xs text-gray-500">Tap a product to add it to the order.</p>
        </div>
      ) : (
        <ul className="max-h-[40vh] divide-y divide-gray-100 overflow-y-auto">
          {orderItems.map((item, index) => {
            const owner = getOwnerOption(item.product.owner);
            const isEditing = editingIndex === index;
            return (
              <li key={`${item.product.id}-${index}`} className="px-5 py-3">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${owner.dot}`} />
                      <span className="truncate">{item.product.name}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {item.product.sellingPrice} SAR each
                      <span className="text-emerald-600"> · +{((item.product.sellingPrice - item.product.cost) * item.quantity).toFixed(0)} profit</span>
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-gray-900">
                    {(item.product.sellingPrice * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-lg ring-1 ring-gray-200">
                    <button
                      onClick={() => handleItemUpdate(index, { quantity: item.quantity - 1 })}
                      className="rounded-l-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleItemUpdate(index, { quantity: parseInt(e.target.value) || 0 })}
                      className="w-10 border-0 bg-transparent p-0 text-center text-sm font-semibold tabular-nums focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      aria-label={`${item.product.name} quantity`}
                    />
                    <button
                      onClick={() => handleItemUpdate(index, { quantity: item.quantity + 1 })}
                      className="rounded-r-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                      className={`rounded-lg p-1.5 transition-colors ${isEditing ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
                      aria-label="Edit price for this order"
                      title="Edit cost / price for this order"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleItemUpdate(index, { quantity: 0 })}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-3">
                    <label className="text-xs font-medium text-gray-500">
                      Cost
                      <input
                        type="number"
                        value={item.product.cost}
                        onChange={(e) => handleItemUpdate(index, { cost: Number(e.target.value) || 0 })}
                        className="mt-1 w-full rounded-lg border-0 bg-white px-2.5 py-1.5 text-sm text-gray-900 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                        min="0"
                      />
                    </label>
                    <label className="text-xs font-medium text-gray-500">
                      Selling price
                      <input
                        type="number"
                        value={item.product.sellingPrice}
                        onChange={(e) => handleItemUpdate(index, { sellingPrice: Number(e.target.value) || 0 })}
                        className="mt-1 w-full rounded-lg border-0 bg-white px-2.5 py-1.5 text-sm text-gray-900 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                        min="0"
                      />
                    </label>
                    <p className="col-span-2 text-[11px] text-gray-400">Changes apply to this order only.</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Totals */}
      <div className="space-y-2 border-t border-gray-100 bg-gray-50/60 px-5 py-4 text-sm">
        <Row label="Subtotal" value={`${(order?.subtotal ?? subtotal).toFixed(2)} SAR`} />
        {order?.discount && (
          <Row
            label={`Discount${order.discount.code ? ` (${order.discount.code})` : ''}`}
            value={`-${discountAmount.toFixed(2)} SAR`}
            valueClass="text-emerald-600"
          />
        )}
        {order && (
          <Row
            label={`Shipping · ${order.shippingMethod.name}`}
            value={
              order.isFreeShipping ? (
                <span>
                  <span className="mr-1.5 text-xs text-gray-400 line-through">{order.shippingCost.toFixed(2)}</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </span>
              ) : `${order.shippingCost.toFixed(2)} SAR`
            }
          />
        )}

        {order ? (
          <>
            <div className="flex items-baseline justify-between border-t border-dashed border-gray-200 pt-3">
              <span className="font-semibold text-gray-900">Customer pays</span>
              <span className="text-xl font-bold tabular-nums text-gray-900">{order.total.toFixed(2)} SAR</span>
            </div>
            <Row label={`Payment fees · ${order.paymentMethod.name}`} value={`-${order.paymentFees.toFixed(2)} SAR`} valueClass="text-gray-500" />
            <div className={`mt-2 flex items-center justify-between rounded-xl px-3.5 py-3 ${order.netProfit >= 0 ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'bg-red-50 ring-1 ring-red-100'}`}>
              <span className={`text-sm font-medium ${order.netProfit >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>Net profit</span>
              <span className={`text-lg font-bold tabular-nums ${order.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {order.netProfit.toFixed(2)} SAR
              </span>
            </div>
          </>
        ) : (
          orderItems.length > 0 && (
            <p className="flex items-start gap-1.5 pt-1 text-xs text-gray-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Choose a shipping and payment method to see the total and profit.
            </p>
          )
        )}
      </div>

      {/* Save */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={onSave}
          disabled={isSaving || !order}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : saveLabel}
        </button>
      </div>
    </section>
  );
};

const Row = ({ label, value, valueClass = 'text-gray-900' }: {
  label: string;
  value: ReactNode;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="truncate text-gray-500">{label}</span>
    <span className={`shrink-0 tabular-nums ${valueClass}`}>{value}</span>
  </div>
);
