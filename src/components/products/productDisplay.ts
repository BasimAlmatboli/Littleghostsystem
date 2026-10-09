import { Product } from '../../types';

export const ownerOptions: {
  value: Product['owner'];
  label: string;
  dot: string;
  pill: string;
}[] = [
  { value: 'yassir', label: 'Yassir', dot: 'bg-blue-500', pill: 'bg-blue-50 text-blue-700 ring-blue-200' },
  { value: 'yassir-ahmed', label: 'Yassir & Ahmed', dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { value: 'yassir-manal', label: 'Yassir & Manal', dot: 'bg-pink-500', pill: 'bg-pink-50 text-pink-700 ring-pink-200' },
  { value: 'yassir-abbas', label: 'Yassir & Abbas', dot: 'bg-violet-500', pill: 'bg-violet-50 text-violet-700 ring-violet-200' },
];

export const getOwnerOption = (owner: string) =>
  ownerOptions.find(option => option.value === owner) ?? ownerOptions[0];

// Same grouping as the Events page
// `panel` / `title` / `badge` style the category blocks in the order calculator
export const productCategories = [
  { id: 'tshirts', label: 'T-Shirts', accent: 'bg-blue-500', panel: 'bg-blue-50/60 ring-blue-100', title: 'text-blue-900', badge: 'bg-blue-100 text-blue-700' },
  { id: 'hoodies', label: 'Hoodies', accent: 'bg-amber-500', panel: 'bg-amber-50/60 ring-amber-100', title: 'text-amber-900', badge: 'bg-amber-100 text-amber-700' },
  { id: 'zipups', label: 'Zip-Up Hoodies', accent: 'bg-purple-500', panel: 'bg-purple-50/60 ring-purple-100', title: 'text-purple-900', badge: 'bg-purple-100 text-purple-700' },
  { id: 'shorts', label: 'Shorts', accent: 'bg-green-500', panel: 'bg-green-50/60 ring-green-100', title: 'text-green-900', badge: 'bg-green-100 text-green-700' },
  { id: 'pants', label: 'Pants', accent: 'bg-indigo-500', panel: 'bg-indigo-50/60 ring-indigo-100', title: 'text-indigo-900', badge: 'bg-indigo-100 text-indigo-700' },
  { id: 'accessories', label: 'Accessories', accent: 'bg-teal-500', panel: 'bg-teal-50/60 ring-teal-100', title: 'text-teal-900', badge: 'bg-teal-100 text-teal-700' },
] as const;

export type ProductCategoryId = typeof productCategories[number]['id'];

export const getProductCategory = (name: string): ProductCategoryId => {
  const upper = name.toUpperCase();
  if (upper.includes('T-SHIRT')) return 'tshirts';
  if (upper.includes('ZIP-UP') && upper.includes('HOODIE')) return 'zipups';
  if (upper.includes('HOODIE')) return 'hoodies';
  if (upper.includes('SHORT')) return 'shorts';
  if (upper.includes('PANTS')) return 'pants';
  return 'accessories';
};

// Markup over cost, as previously shown in the "Profit Margin" column
export const calculateMargin = (cost: number, sellingPrice: number) =>
  cost > 0 ? ((sellingPrice - cost) / cost) * 100 : 0;
