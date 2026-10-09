import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProductSelect } from '../components/ProductSelect';
import { ShippingSelect } from '../components/ShippingSelect';
import { PaymentSelect } from '../components/PaymentSelect';
import { OrderSummary } from '../components/OrderSummary';
import { DiscountInput } from '../components/DiscountInput';
import { OrderCart } from '../components/calculator/OrderCart';
import { saveOrder, getOrderById } from '../services/orderService';
import { useOrder } from '../hooks/useOrder';
import { Loader2, User, Save, Hash, Calculator as CalculatorIcon, ChevronUp } from 'lucide-react';

export const Calculator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editOrderId = searchParams.get('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editOrderId);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    orderNumber,
    setOrderNumber,
    customerName,
    setCustomerName,
    orderItems,
    setOrderItems,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    isFreeShipping,
    setIsFreeShipping,
    discount,
    setDiscount,
    order,
    setInitialOrder,
    setShippingMethodCost,
  } = useOrder();

  // Load existing order if editing
  useEffect(() => {
    const loadOrder = async () => {
      if (editOrderId) {
        try {
          setIsLoading(true);
          setLoadError(null);
          const existingOrder = await getOrderById(editOrderId);
          
          if (existingOrder) {
            setInitialOrder(existingOrder);
          } else {
            setLoadError('Order not found');
          }
        } catch (error) {
          console.error('Error loading order:', error);
          setLoadError('Failed to load order details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadOrder();
  }, [editOrderId]);

  const handleSaveOrder = async () => {
    if (!order) {
      alert('Please complete all required fields');
      return;
    }
    
    if (!orderNumber.trim()) {
      alert('Please enter an order number');
      return;
    }

    if (orderItems.length === 0) {
      alert('Please add at least one product');
      return;
    }

    if (!shippingMethod) {
      alert('Please select a shipping method');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      setIsSaving(true);
      await saveOrder(order);
      navigate('/orders', { replace: true });
    } catch (error) {
      console.error('Error saving order:', error);
      alert('There was an error saving the order. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {loadError}
          </div>
        </div>
      </div>
    );
  }

  const saveLabel = editOrderId ? 'Update order' : 'Save order';
  const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const runningSubtotal = orderItems.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 pb-28 lg:pb-12">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
            <CalculatorIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {editOrderId ? 'Edit Order' : 'New Order'}
            </h1>
            <p className="text-sm text-gray-500">Add products, pick shipping and payment, and see your profit live.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Order details, shipping & payment */}
          <section className="divide-y divide-gray-100 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
              <div>
                <label htmlFor="orderNumber" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <Hash className="h-3.5 w-3.5 text-gray-400" />
                  Order number <span className="text-red-500">*</span>
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  placeholder="Enter order number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full rounded-xl border-0 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 placeholder:font-normal placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="customerName" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  Customer name <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  id="customerName"
                  type="text"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border-0 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 ring-1 ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-4">
              <ShippingSelect
                selected={shippingMethod}
                onSelect={setShippingMethod}
                onShippingMethodCostChange={setShippingMethodCost}
                isFreeShipping={isFreeShipping}
                onFreeShippingChange={setIsFreeShipping}
              />
            </div>
            <div className="p-4">
              <PaymentSelect
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />
            </div>
          </section>

          {/* Products Section */}
          <ProductSelect
            orderItems={orderItems}
            onOrderItemsChange={setOrderItems}
          />

          {/* Discount */}
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200/70">
            <DiscountInput onApplyDiscount={setDiscount} activeDiscount={discount} />
          </section>

          {/* Profit sharing */}
          {order && <OrderSummary order={order} />}
        </div>

        {/* Right column: order panel */}
        <aside id="order-panel" className="scroll-mt-4 lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-6">
            <OrderCart
              orderItems={orderItems}
              onOrderItemsChange={setOrderItems}
              order={order}
              orderNumber={orderNumber}
              isSaving={isSaving}
              saveLabel={saveLabel}
              onSave={handleSaveOrder}
            />
          </div>
        </aside>
      </div>

      {/* Mobile bottom bar */}
      {orderItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <button
              onClick={() => document.getElementById('order-panel')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-1 items-center gap-2 text-left"
            >
              <span className="flex h-9 min-w-[36px] items-center justify-center rounded-xl bg-blue-50 px-2 text-sm font-bold text-blue-700">
                {itemCount}
              </span>
              <span>
                <span className="block text-[11px] text-gray-500">{order ? 'Customer pays' : 'Subtotal'}</span>
                <span className="flex items-center gap-1 text-base font-bold tabular-nums text-gray-900">
                  {(order ? order.total : runningSubtotal).toFixed(2)} SAR
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                </span>
              </span>
            </button>
            <button
              onClick={handleSaveOrder}
              disabled={isSaving || !order}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? 'Saving...' : saveLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
