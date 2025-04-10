import { Product } from '../types';

const defaultProducts: Product[] = [
{
    id: 'BLACK-TEE-LAZY-GHOST',
    name: 'LAZY GHOST T-SHIRT',
    cost: 70,
    sellingPrice: 149,
    owner: 'yassir-ahmed'  // Co-owned by Yassir and Ahmed
  },
  {
    id: 'DARK-GREEN-TEE-BOLD-RABEL',
    name: 'DARK GREEN T-SHIRT',
    cost: 70,
    sellingPrice: 149,
    owner: 'yassir-ahmed'  // Co-owned by Yassir and Ahmed
  },
  {
    id: 'OFF-WHITE-TEE-GHOST',
    name: 'OFF WHITE T-SHIRT',
    cost: 70,
    sellingPrice: 159,
    owner: 'yassir-ahmed'  // Co-owned by Yassir and Ahmed
  }, 
  {
    id: 'BLACK-TEE-ROSE',
    name: 'TEE ROSE T-SHIRT',
    cost: 70,
    sellingPrice: 149,
    owner: 'yassir-ahmed'  // Co-owned by Yassir and Ahmed
  },
  {
    id: 'BLACK-HOODIE',
    name: 'BLACK HOODIE',
    cost: 40,
    sellingPrice: 189,
    owner: 'yassir-manal'  // Co-owned by Yassir and Manal
  },
  {
    id: 'PINK-HOODIE',
    name: 'PINK HOODIE',
    cost: 40,
    sellingPrice: 169,
    owner: 'yassir-manal'  // Co-owned by Yassir and Manal
  },
  {
    id: 'BABY-BLUE-HOODIE',
    name: 'BABY BLUE HOODIE',
    cost: 40,
    sellingPrice: 189,
    owner: 'yassir-manal'  // Co-owned by Yassir and Manal
  }, 
  {
    id: 'DARK-GREEY-HOODIE',
    name: 'DARK GREEY HOODIE',
    cost: 40,
    sellingPrice: 189,
    owner: 'yassir-manal'  // Co-owned by Yassir and Manal
  },
];

export const getProducts = (): Product[] => {
  const savedProducts = localStorage.getItem('products');
  return savedProducts ? JSON.parse(savedProducts) : defaultProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};