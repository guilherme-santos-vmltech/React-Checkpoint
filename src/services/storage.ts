import { Product } from '../types/product';

export const storageService = {
getWishlistedProducts(): Product[] {
  const saved = localStorage.getItem("products");
  return saved ? JSON.parse(saved) : [];
},

saveWishlistedProducts(products: Product[]): void {
  localStorage.setItem("products", JSON.stringify(products));
}
};