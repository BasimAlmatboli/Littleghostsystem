export const calculatePaymentFees = (
  paymentMethodId: string,
  amount: number
): number => {
  switch (paymentMethodId) {
    case 'mada':
      return calculateMadaFees(amount);
    case 'visa':
      return calculateVisaFees(amount);
    case 'tamara':
      return calculateTamaraFees(amount);
    case 'cash':
      return 0; // No fees for cash payments
    default:
      return 0;
  }
};

export const calculateMadaFees = (amount: number): number => {
  const paymentGatewayFee = amount * 0.01;
  const purchaseExperienceFee = 1;
  const baseFees = paymentGatewayFee + purchaseExperienceFee;
  const feesTax = baseFees * 0.15;
  return baseFees + feesTax;
};

export const calculateVisaFees = (amount: number): number => {
  const paymentGatewayFee = amount * 0.022;
  const purchaseExperienceFee = 1;
  const baseFees = paymentGatewayFee + purchaseExperienceFee;
  const feesTax = baseFees * 0.15;
  return baseFees + feesTax;
};

export const calculateTamaraFees = (amount: number): number => {
  const fixedFee = 1.5;
  const variableFee = amount * 0.07;
  const baseFees = fixedFee + variableFee;
  const feesTax = baseFees * 0.15;
  return baseFees + feesTax;
};