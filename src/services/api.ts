import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

// 1. Definimos la forma exacta de una Categoría
export interface Category {
  id: string;
  nombre: string;
  imagen: string;
}

// 2. Definimos la forma exacta de un Producto
export interface Product {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  precio: number;
  precioMayorista: number;
  precioAnterior: number | null;
  stock: number;
  imagenes: string[];
  destacado: boolean;
  etiquetas: string[];
  especificaciones: Record<string, string>;
}

// Utilidad para simular el retardo de red (500ms a 800ms)
const randomDelay = () => {
  const ms = Math.floor(Math.random() * 300) + 500;
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 3. Funciones exportadas con aserción doble para calmar a TypeScript
export const getProducts = async (): Promise<Product[]> => {
  await randomDelay();
  return productsData as unknown as Product[];
};

export const getCategories = async (): Promise<Category[]> => {
  await randomDelay();
  return categoriesData as unknown as Category[];
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await randomDelay();
  const products = productsData as unknown as Product[];
  return products.find(product => product.id === id);
};