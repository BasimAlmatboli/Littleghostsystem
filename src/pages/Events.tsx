import React, { useState, useEffect } from 'react';
import { useOrder } from '../hooks/useOrder';
import { saveOrder } from '../services/orderService';
import { getProducts } from '../data/products';
import { getShippingMethods } from '../data/shipping';
import { generateRandomOrderNumber } from '../utils/generateOrderNumber';
import { OrderConfirmationModal } from '../components/events/OrderConfirmationModal';
import { Loader2, RotateCcw, Plus, Minus, Trash2, Tag } from 'lucide-react';
import { Product, OrderItem } from '../types';

export const Events = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedOrder, setSavedOrder] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showDiscountSection, setShowDiscountSection] = useState(false);

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
  } = useOrder();

  // Initialize with defaults
  useEffect(() => {
    const products = getProducts();
    setAllProducts(products);

    const shippingMethods = getShippingMethods();
    const noShipping = shippingMethods.find(m => m.id === 'no-shipping');
    if (noShipping && !shippingMethod) {
      setShippingMethod(noShipping);
    }

    const defaultPayment = { id: 'mada' as const, name: 'MADA' };
    if (!paymentMethod) {
      setPaymentMethod(defaultPayment);
    }

    if (!orderNumber) {
      setOrderNumber(generateRandomOrderNumber());
    }
  }, []);

  const handleRefreshOrderNumber = () => {
    setOrderNumber(generateRandomOrderNumber());
  };

  const handleProductQuantityChange = (index: number, quantity: number) => {
    if (quantity <= 0) {
      const updatedItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(updatedItems);
    } else {
      const updatedItems = [...orderItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity,
      };
      setOrderItems(updatedItems);
    }
  };

  const handleRemoveProduct = (index: number) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };

  const handleAddProduct = (product: Product) => {
    const existingIndex = orderItems.findIndex(item => item.product.id === product.id);

    if (existingIndex >= 0) {
      const updatedItems = [...orderItems];
      updatedItems[existingIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      setOrderItems([...orderItems, { product, quantity: 1 }]);
    }
  };

  const handleSaveOrder = async () => {
    if (!order) {
      alert('Please complete the order');
      return;
    }

    if (orderItems.length === 0) {
      alert('Please add at least one product');
      return;
    }

    try {
      setIsSaving(true);
      await saveOrder(order);
      setSavedOrder(order);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewOrder = () => {
    setShowConfirmation(false);
    setSavedOrder(null);
    setOrderNumber(generateRandomOrderNumber());
    setCustomerName('');
    setOrderItems([]);
    setShowDiscountSection(false);
    setDiscount(null);
  };

  const tShirts = allProducts.filter(p => p.name.toUpperCase().includes('T-SHIRT'));
  const hoodies = allProducts.filter(p => p.name.toUpperCase().includes('HOODIE'));
  const shorts = allProducts.filter(p => p.name.toUpperCase().includes('SHORT'));

  if (!shippingMethod || !paymentMethod) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order #
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={orderNumber}
                    readOnly
                    className="flex-1 text-center text-2xl font-bold bg-gray-100 rounded-lg p-3 border-2 border-gray-200"
                  />
                  <button
                    onClick={handleRefreshOrderNumber}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                    title="Generate new order number"
                  >
                    <RotateCcw className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-lg bg-white rounded-lg p-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            {/* T-Shirts */}
            {tShirts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">T-Shirts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {tShirts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 rounded-lg p-3 transition-all hover:shadow-md active:scale-95"
                    >
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        {product.sellingPrice} SAR
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hoodies */}
            {hoodies.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hoodies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {hoodies.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 rounded-lg p-3 transition-all hover:shadow-md active:scale-95"
                    >
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-purple-600">
                        {product.sellingPrice} SAR
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shorts */}
            {shorts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Shorts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {shorts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 rounded-lg p-3 transition-all hover:shadow-md active:scale-95"
                    >
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-green-600">
                        {product.sellingPrice} SAR
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary & Controls */}
        <div className="space-y-4">
          {/* Shipping & Payment */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Shipping</p>
              <p className="text-lg font-bold text-gray-900">{shippingMethod.name}</p>
              <p className="text-sm text-gray-600">{shippingMethod.cost} SAR</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Payment</p>
              <p className="text-lg font-bold text-gray-900">{paymentMethod.name}</p>
            </div>
          </div>

          {/* Selected Items */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items ({orderItems.length})</h3>
            {orderItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items added yet</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {orderItems.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.product.sellingPrice} SAR each
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => handleProductQuantityChange(index, item.quantity - 1)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleProductQuantityChange(index, item.quantity + 1)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-1.5 rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded transition-colors ml-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discount Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <button
              onClick={() => setShowDiscountSection(!showDiscountSection)}
              className="w-full flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Tag className="h-5 w-5" />
              <span>Discount</span>
              <span className="ml-auto text-sm text-gray-500">
                {discount ? '✓' : '+'}
              </span>
            </button>

            {showDiscountSection && (
              <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setDiscount(
                          discount?.type === 'percentage'
                            ? discount
                            : { type: 'percentage', value: 0 }
                        )
                      }
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                        discount?.type === 'percentage'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      %
                    </button>
                    <button
                      onClick={() =>
                        setDiscount(
                          discount?.type === 'fixed'
                            ? discount
                            : { type: 'fixed', value: 0 }
                        )
                      }
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                        discount?.type === 'fixed'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      SAR
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={discount?.value || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDiscount(
                        discount
                          ? { ...discount, value: val }
                          : { type: 'fixed', value: val }
                      );
                    }}
                    className="w-full text-lg font-bold bg-white rounded-lg p-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                  />
                </div>

                {discount && (
                  <button
                    onClick={() => setDiscount(null)}
                    className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg font-medium transition-colors"
                  >
                    Clear Discount
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Order Total */}
          {order && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm p-4 md:p-6 space-y-3 border-2 border-green-200">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  {order.subtotal.toFixed(2)} SAR
                </span>
              </div>

              {discount && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Discount:</span>
                  <span className="font-semibold">
                    -{(discount.type === 'percentage' ? (order.subtotal * discount.value) / 100 : discount.value).toFixed(2)} SAR
                  </span>
                </div>
              )}

              {!isFreeShipping && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Shipping:</span>
                  <span className="font-semibold text-gray-900">
                    {order.shippingCost.toFixed(2)} SAR
                  </span>
                </div>
              )}

              {order.paymentFees > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Payment Fee:</span>
                  <span className="font-semibold text-gray-900">
                    {order.paymentFees.toFixed(2)} SAR
                  </span>
                </div>
              )}

              <div className="border-t-2 border-green-200 pt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-3xl font-bold text-green-600">
                  {order.total.toFixed(2)} SAR
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Net Profit:</span>
                <span className="text-xl font-bold text-blue-600">
                  {order.netProfit.toFixed(2)} SAR
                </span>
              </div>
            </div>
          )}

          {/* Save Button */}
          {order && (
            <button
              onClick={handleSaveOrder}
              disabled={isSaving || orderItems.length === 0}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                isSaving || orderItems.length === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
              }`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save Order'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && savedOrder && (
        <OrderConfirmationModal order={savedOrder} onNewOrder={handleNewOrder} />
      )}
    </div>
  );
};
