import { useState } from 'react';
import { Package, Truck, Settings as SettingsIcon } from 'lucide-react';
import { ProductSettings } from '../components/settings/ProductSettings';
import { ShippingSettings } from '../components/settings/ShippingSettings';

type SettingsTab = 'products' | 'shipping';

const tabs: { id: SettingsTab; label: string; description: string; icon: typeof Package }[] = [
  { id: 'products', label: 'Products', description: 'Prices, costs & owners', icon: Package },
  { id: 'shipping', label: 'Shipping', description: 'Delivery methods & costs', icon: Truck },
];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('products');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-0">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">Manage your product catalog and shipping options</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-1" role="tablist">
            {tabs.map(({ id, label, description, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(id)}
                  className={`group relative flex items-center gap-3 rounded-t-xl px-5 py-3 text-left transition-colors ${isActive ? 'text-blue-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="hidden sm:block text-xs font-normal text-gray-400">{description}</span>
                  </span>
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Both tabs stay mounted so unsaved edits survive switching tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className={activeTab === 'products' ? '' : 'hidden'}>
          <ProductSettings isActive={activeTab === 'products'} />
        </div>
        <div className={activeTab === 'shipping' ? '' : 'hidden'}>
          <ShippingSettings isActive={activeTab === 'shipping'} />
        </div>
      </div>
    </div>
  );
};
