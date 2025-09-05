export interface Product {
  id: string;
  name: string;
  cost: number;
  sellingPrice: number;
  owner: 'yassir' | 'yassir-ahmed' | 'yassir-manal' | 'yassir-abbas';
}

export interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
}

export interface PaymentMethod {
  id: 'cash' | 'mada' | 'visa' | 'tamara';
  name: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  code?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  date: string;
  items: OrderItem[];
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  paymentFees: number;
  discount: Discount | null;
  total: number;
  netProfit: number;
  isFreeShipping: boolean;
}