import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { getLocalProducts } from '../data/products';

interface SupabaseProduct {
  id: string;
  name: string;
  cost: number;
  selling_price: number;
  owner: Product['owner'];
  sort_order: number;
}

const transformSupabaseProduct = (row: SupabaseProduct): Product => ({
  id: row.id,
  name: row.name,
  cost: Number(row.cost),
  sellingPrice: Number(row.selling_price),
  owner: row.owner,
});

const transformProductForSupabase = (product: Product, sortOrder: number) => ({
  id: product.id,
  name: product.name,
  cost: product.cost,
  selling_price: product.sellingPrice,
  owner: product.owner,
  sort_order: sortOrder,
  updated_at: new Date().toISOString(),
});

/**
 * Loads products from Supabase. Falls back to the built-in list if the
 * products table is missing or empty, so order entry keeps working.
 */
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error('Error loading products, using built-in list:', error);
    return getLocalProducts();
  }

  return (data as SupabaseProduct[]).map(transformSupabaseProduct);
};

/**
 * Saves the full product list (in display order) and removes deleted products.
 */
export const saveProducts = async (
  products: Product[],
  deletedIds: string[] = []
): Promise<void> => {
  if (products.length) {
    const { error } = await supabase
      .from('products')
      .upsert(products.map(transformProductForSupabase), { onConflict: 'id' });

    if (error) {
      console.error('Error saving products:', error);
      throw error;
    }
  }

  if (deletedIds.length) {
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', deletedIds);

    if (error) {
      console.error('Error deleting products:', error);
      throw error;
    }
  }
};

export const addProduct = async (product: Product, sortOrder: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .insert(transformProductForSupabase(product, sortOrder));

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};
