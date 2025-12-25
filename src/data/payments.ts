import { PaymentMethod } from '../types';

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'mada',
    name: 'MADA',
  },
  {
    id: 'visa',
    name: 'Visa',
  },
  {
    id: 'cash',
    name: 'Cash',
  },
  {
    id: 'tamara',
    name: 'Tamara',
  },
];

export const getPaymentMethods = (): PaymentMethod[] => {
  const savedMethods = localStorage.getItem('paymentMethods');
  return savedMethods ? JSON.parse(savedMethods) : defaultPaymentMethods;
};

export const savePaymentMethods = (methods: PaymentMethod[]) => {
  localStorage.setItem('paymentMethods', JSON.stringify(methods));
};
