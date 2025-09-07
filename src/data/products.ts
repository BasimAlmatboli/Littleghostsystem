import { Product } from '../types';

const defaultProducts: Product[] = [
{
    id: 'LAZY GHOST T-SHIRT',
    name: 'LAZY GHOST T-SHIRT',
    cost: 41,
    sellingPrice: 149,
    owner: 'yassir'  // 100% owned by Yassir
  },
  {
    id: 'DARK GREEN T-SHIRT',
    name: 'DARK GREEN T-SHIRT',
    cost: 45,
    sellingPrice: 149,
    owner: 'yassir'  // 100% owned by Yassir
  },
  {
    id: 'OFF WHITE T-SHIRT',
    name: 'OFF WHITE T-SHIRT',
    cost: 45,
    sellingPrice: 159,
    owner: 'yassir'  // 100% owned by Yassir
  }, 
  {
    id: 'TEE ROSE T-SHIRT',
    name: 'TEE ROSE T-SHIRT',
    cost: 45,
    sellingPrice: 149,
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
    sellingPrice: 169,
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
    id: 'Black Short',
    name: 'Black Short',
    cost: 52,
    sellingPrice: 179,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
    {
    id: 'Green Short',
    name: 'Green Short',
    cost: 52,
    sellingPrice: 179,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
    {
    id: 'Blue Short',
    name: 'Blue Short',
    cost: 52,
    sellingPrice: 179,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
    {
    id: 'Gray Short',
    name: 'Gray Short',
    cost: 52,
    sellingPrice: 179,
    owner: 'yassir-abbas'  // Co-owned by Yassir and Abbas
  },
];

export const getProducts = (): Product[] => {
  const savedProducts = localStorage.getItem('products');
  return savedProducts ? JSON.parse(savedProducts) : defaultProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};