import { useState, useEffect } from 'react';
import { Order, OrderItem, ShippingMethod, PaymentMethod, Discount } from '../types';
import { calculatePaymentFees } from '../utils/calculateFees';
import { generateUUID } from '../utils/uuid';

export const useOrder = (initialOrder?: Order | null) => {
  const [orderNumber, setOrderNumber] = useState(initialOrder?.orderNumber || '');
  const [customerName, setCustomerName] = useState(initialOrder?.customerName || '');
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrder?.items || []);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(
    initialOrder?.shippingMethod || null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    initialOrder?.paymentMethod || null
  );
  const [isFreeShipping, setIsFreeShipping] = useState(initialOrder?.isFreeShipping || false);
  const [discount, setDiscount] = useState<Discount | null>(initialOrder?.discount || null);
  const [order, setOrder] = useState<Order | null>(initialOrder || null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(initialOrder?.id || null);

  // Function to update shipping method cost for this order only
  const setShippingMethodCost = (cost: number) => {
    if (shippingMethod) {
      setShippingMethod({
        ...shippingMethod,
        cost
      });
    }
  };

  // Function to set initial order data
  const setInitialOrder = (order: Order) => {
    setCurrentOrderId(order.id);
    setOrderNumber(order.orderNumber);
    setCustomerName(order.customerName || '');
    setOrderItems(order.items);
    setShippingMethod(order.shippingMethod);
    setPaymentMethod(order.paymentMethod);
    setIsFreeShipping(order.isFreeShipping);
    setDiscount(order.discount);
  };

  useEffect(() => {
    if (orderItems.length && shippingMethod && paymentMethod) {
      const subtotal = orderItems.reduce(
        (sum, item) => sum + (item.product.sellingPrice * item.quantity),
        0
      );

      const totalCost = orderItems.reduce(
        (sum, item) => sum + item.product.cost * item.quantity,
        0
      );

      const shippingAmount = isFreeShipping ? 0 : shippingMethod.cost;
      const discountAmount = discount
        ? discount.type === 'percentage'
          ? (subtotal * discount.value) / 100
          : discount.value
        : 0;

      // Calculate payment fees based on the final amount charged to the customer
      const customerTotal = subtotal + shippingAmount - discountAmount;
      const paymentFees = calculatePaymentFees(
        paymentMethod.id,
        customerTotal
      );

      // Total is what the customer actually pays (excluding internal payment fees)
      const total = customerTotal;
      
      // Net profit calculation: subtract all business costs from customer payment
      // - totalCost: cost of products
      // - shippingMethod.cost: actual shipping cost to business (even if customer got free shipping)
      // - paymentFees: payment processing fees
      const netProfit = total - totalCost - shippingMethod.cost - paymentFees;

      setOrder({
        id: currentOrderId || generateUUID(),
        orderNumber,
        customerName: customerName || undefined,
        date: initialOrder?.date || new Date().toISOString(),
        items: orderItems,
        shippingMethod,
        paymentMethod,
        subtotal,
        shippingCost: shippingMethod.cost,
        paymentFees,
        discount,
        total,
        netProfit,
        isFreeShipping,
      });
    } else {
      setOrder(null);
    }
  }, [orderItems, shippingMethod, paymentMethod, isFreeShipping, discount, orderNumber, customerName, currentOrderId, initialOrder]);

  return {
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
  };
};