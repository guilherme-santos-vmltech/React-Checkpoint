import { useState, useEffect } from 'react';
import { Product } from '../../types/product.tsx';
import { productApi } from '../../services/api.ts';
import { storageService } from '../../services/storage.ts';

export const useProducts = (wishlistUpdate: number) => {
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchProducts();
}, [wishlistUpdate]);

const fetchProducts = async () => {
  try {
    const data = await productApi.getAllProducts();
    const savedProducts = storageService.getWishlistedProducts();
    
    const productsWithWishlist = data.map((product: Product) => ({
      ...product,
      isWishlisted: savedProducts.some(p => p.id === product.id && p.isWishlisted),
    }));

    setProducts(productsWithWishlist);
    setLoading(false);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
    setLoading(false);
  }
};

const toggleWishlist = (e: React.MouseEvent, productId: number) => {
  e.stopPropagation();
  setProducts((prevProducts) => {
    const updatedProducts = prevProducts.map((product) =>
      product.id === productId
        ? { ...product, isWishlisted: !product.isWishlisted }
        : product
    );
    storageService.saveWishlistedProducts(updatedProducts);
    return updatedProducts;
  });
};

return { products, loading, error, toggleWishlist };
};