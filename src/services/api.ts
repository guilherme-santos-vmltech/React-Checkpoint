import { Product } from '../types/product';

const BASE_URL = "https://fakestoreapi.com";

export const productApi = {
async getAllProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
},

};