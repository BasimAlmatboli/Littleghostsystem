import { Product } from '../types';

const defaultProducts: Product[] = [
  {
    id: 'LAZY GHOST T-SHIRT',
    name: 'LAZY GHOST T-SHIRT',
    cost: 41,
    sellingPrice: 179,
    owner: 'yassir'  // 100% owned by Yassir
  },
  {
    id: 'DARK GREEN T-SHIRT',
    name: 'DARK GREEN T-SHIRT',
    cost: 45,
    sellingPrice: 179,
    owner: 'yassir'  // 100% owned by Yassir
  },
  {
    id: 'OFF WHITE T-SHIRT',
    name: 'OFF WHITE T-SHIRT',
    cost: 45,
    sellingPrice: 179,
    owner: 'yassir'  // 100% owned by Yassir
  },
  {
    id: 'TEE ROSE T-SHIRT',
    name: 'TEE ROSE T-SHIRT',
    cost: 45,
    sellingPrice: 179,
    owner: 'yassir'  // 100% owned by Yassir
  },
  {
    id: 'BLACK HOODIE',
    name: 'BLACK HOODIE',
    cost: 40,
    sellingPrice: 189,
    owner: 'yassir-manal'  // Co-owned by Yassir and Manal
  },
  {
    id: 'PINK HOODIE',
    name: 'PINK HOODIE',
    cost: 40,
    sellingPrice: 189,
    owner: 'yassir-manal'  // Co-owned by Yassir and Manal
  },
  {
    id: 'BABY BLUE HOODIE',
    name: 'BABY BLUE HOODIE',
    cost: 40,
    sellingPrice: 189,
    owner: 'yassir-manal'  // Co-owned by Yassir and Manal
  },
  {
    id: 'DARK GREEY HOODIE',
    name: 'DARK GREEY HOODIE',
    cost: 40,
    sellingPrice: 189,
    owner: 'yassir-manal'  // Co-owned by Yassir and Manal
  },
  {
    id: 'Black T-SHIRT',
    name: 'Black T-SHIRT',
    cost: 37,
    sellingPrice: 179,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'Creamy T-SHIRT',
    name: 'Creamy T-SHIRT',
    cost: 37,
    sellingPrice: 179,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'Blue T-shirt',
    name: 'Blue T-shirt',
    cost: 37,
    sellingPrice: 179,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'Black Short',
    name: 'Black Short',
    cost: 52,
    sellingPrice: 169,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'Green Short',
    name: 'Green Short',
    cost: 52,
    sellingPrice: 169,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'Blue Short',
    name: 'Blue Short',
    cost: 52,
    sellingPrice: 169,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'Gray Short',
    name: 'Gray Short',
    cost: 52,
    sellingPrice: 169,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'ZIP-UP DARK GREY HOODIE',
    name: 'ZIP-UP DARK GREY HOODIE',
    cost: 85,
    sellingPrice: 269,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'PANTS DARK GREY',
    name: 'PANTS DARK GREY',
    cost: 85,
    sellingPrice: 269,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'ZIP-UP GREY HOODIE',
    name: 'ZIP-UP GREY HOODIE',
    cost: 85,
    sellingPrice: 269,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'PANTS GREY',
    name: 'PANTS GREY',
    cost: 85,
    sellingPrice: 269,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'LONG SLEEVE T-SHIRT',
    name: 'LONG SLEEVE T-SHIRT',
    cost: 31,
    sellingPrice: 139,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'BASIC T-SHIRT',
    name: 'BASIC T-SHIRT',
    cost: 25,
    sellingPrice: 89,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'SEAM T-SHIRT',
    name: 'SEAM T-SHIRT',
    cost: 36,
    sellingPrice: 149,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
  {
    id: 'CAP',
    name: 'CAP',
    cost: 30,
    sellingPrice: 109,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
];

// Fallback product list (browser copy merged with defaults), used when the
// Supabase products table is unavailable. See src/services/productService.ts.
export const getLocalProducts = (): Product[] => {
  const savedProducts = localStorage.getItem('products');
  if (!savedProducts) return defaultProducts;
  try {
    const parsed: Product[] = JSON.parse(savedProducts);
    const merged = [...parsed];
    let hasChanges = false;
    defaultProducts.forEach(defProd => {
      if (!merged.some(p => p.id === defProd.id)) {
        merged.push(defProd);
        hasChanges = true;
      }
    });
    if (hasChanges) {
      saveLocalProducts(merged);
    }
    return merged;
  } catch (e) {
    console.error('Failed to parse saved products, falling back to defaults', e);
    return defaultProducts;
  }
};

const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};