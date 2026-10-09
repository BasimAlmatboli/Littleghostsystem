import { useState, ReactNode } from 'react';
import { Order } from '../types';
import { calculateTotalProfitShare } from '../utils/profitSharing';
import { EarningsReport } from './EarningsReport';
import { PieChart, ChevronDown, CreditCard } from 'lucide-react';

interface OrderSummaryProps {
  order: Order;
}

const partners = [
  { key: 'totalYassirShare', itemKey: 'yassirShare', name: 'Yassir', card: 'from-blue-50 to-indigo-50 ring-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  { key: 'totalAhmedShare', itemKey: 'ahmedShare', name: 'Ahmed', card: 'from-amber-50 to-orange-50 ring-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  { key: 'totalManalShare', itemKey: 'manalShare', name: 'Manal', card: 'from-pink-50 to-rose-50 ring-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  { key: 'totalAbbasShare', itemKey: 'abbasShare', name: 'Abbas', card: 'from-violet-50 to-purple-50 ring-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
] as const;

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  const discountAmount = order.discount
    ? order.discount.type === 'percentage'
      ? (order.subtotal * order.discount.value) / 100
      : order.discount.value
    : 0;

  // Calculate the actual total paid by customer
  const customerTotal = order.subtotal + (order.isFreeShipping ? 0 : order.shippingCost) - discountAmount;

  // Calculate detailed profit sharing
  const profitSharing = calculateTotalProfitShare(
    order.items,
    order.shippingCost,
    order.paymentFees,
    discountAmount,
    order.isFreeShipping
  );

  // Get payment fee percentage for display
  const getPaymentFeePercentage = () => {
    switch (order.paymentMethod.id) {
      case 'mada':
        return '1% + 1 SAR + 15% VAT';
      case 'visa':
        return '2.2% + 1 SAR + 15% VAT';
      case 'tamara':
        return '7% + 1.5 SAR + 15% VAT';
      default:
        return '0%';
    }
  };

  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
        <PieChart className="h-5 w-5 text-blue-600" />
        <h2 className="text-base font-semibold text-gray-900">Profit sharing</h2>
      </div>

      <div className="space-y-4 p-5">
        {/* Partner totals */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {partners.map(partner => (
            <div key={partner.key} className={`rounded-xl bg-gradient-to-br p-3.5 ring-1 ${partner.card}`}>
              <p className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <span className={`h-2 w-2 rounded-full ${partner.dot}`} />
                {partner.name}
              </p>
              <p className={`mt-1 text-lg font-bold tabular-nums ${partner.text}`}>
                {profitSharing[partner.key].toFixed(2)}
                <span className="ml-1 text-xs font-medium opacity-70">SAR</span>
              </p>
            </div>
          ))}
        </div>

        {/* Payment Fee Breakdown */}
        {order.paymentMethod.id !== 'cash' && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5 font-medium text-gray-800">
              <CreditCard className="h-3.5 w-3.5 text-gray-400" />
              {order.paymentMethod.name} fee
            </span>
            <span>Base: <span className="font-medium text-gray-900">{customerTotal.toFixed(2)} SAR</span></span>
            <span>Rate: <span className="font-medium text-gray-900">{getPaymentFeePercentage()}</span></span>
            <span>Fee: <span className="font-medium text-gray-900">{order.paymentFees.toFixed(2)} SAR</span></span>
          </div>
        )}

        {/* Per Product Breakdown */}
        <Collapsible title="Per-product breakdown">
          <div className="space-y-3">
            {profitSharing.itemShares.map((share, index) => {
              const item = order.items[index];
              return (
                <div key={item.product.id} className="rounded-xl ring-1 ring-gray-200">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                    <span className="text-sm font-medium text-gray-900">
                      {item.product.name} <span className="text-gray-400">×{item.quantity}</span>
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">{share.netProfit.toFixed(2)} SAR</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3 text-xs sm:grid-cols-4">
                    <Stat label="Total" value={`${share.total.toFixed(2)} SAR`} />
                    <Stat label="Cost" value={`-${share.cost.toFixed(2)} SAR`} valueClass="text-red-600" />
                    <Stat label={`Expenses (${(share.revenueProportion * 100).toFixed(1)}%)`} value={`-${share.expenseShare.toFixed(2)} SAR`} valueClass="text-red-600" />
                    <Stat label="Net profit" value={`${share.netProfit.toFixed(2)} SAR`} valueClass="text-emerald-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-100 bg-gray-50/60 px-4 py-3 text-xs sm:grid-cols-4">
                    {partners.map(partner => (
                      <Stat
                        key={partner.itemKey}
                        label={partner.name}
                        value={`${share[partner.itemKey].toFixed(2)} SAR`}
                        valueClass={partner.text}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Collapsible>

        {/* Earnings Report */}
        <Collapsible title="Total earnings report">
          <EarningsReport
            items={order.items}
            totalYassirShare={profitSharing.totalYassirShare}
            totalAhmedShare={profitSharing.totalAhmedShare}
            totalManalShare={profitSharing.totalManalShare}
            totalAbbasShare={profitSharing.totalAbbasShare}
          />
        </Collapsible>
      </div>
    </section>
  );
};

const Stat = ({ label, value, valueClass = 'text-gray-900' }: { label: string; value: string; valueClass?: string }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className={`font-semibold tabular-nums ${valueClass}`}>{value}</p>
  </div>
);

const Collapsible = ({ title, children }: { title: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-xl ring-1 ring-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        {title}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="border-t border-gray-100 p-4 [&>div]:mt-0">{children}</div>}
    </div>
  );
};
