export const calculatePaymentFees = (
  paymentMethodId: string,
  amount: number,
  shippingCost: number = 0,
  discountAmount: number = 0
): number => {
  // Calculate the total amount that will be charged to the customer
  const totalAmountCharged = amount + shippingCost - discountAmount;

  switch (paymentMethodId) {
    case 'mada':
      return calculateMadaFees(totalAmountCharged);
    case 'visa':
      return calculateVisaFees(totalAmountCharged);
    case 'tamara':
      return calculateTamaraFees(totalAmountCharged);
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