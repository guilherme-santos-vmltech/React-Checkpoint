import React, { useState, useEffect } from 'react';
import styles from './bestSellers.module.css';
import { Product } from '../../types/product';
import ProductCard from '../../components/productCard/productCard.tsx';
import { useWishlist } from '../../context/wishlistContext/wishlistContext.tsx';
import ProductModal from '../../components/productModal/productModal.tsx'; 
import LoadingDots from '../../components/loadingDots/loadingDots.tsx'

const BestSellers: React.FC = () => {
const [bestSellers, setBestSellers] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const { wishlistUpdate, triggerWishlistUpdate } = useWishlist();
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 



useEffect(() => {
  const fetchBestSellers = async () => {
    try {
      const response = await fetch('/products?limit=3');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Merge fetched data with localStorage wishlist status
      const storedProducts = localStorage.getItem('products');
      const parsedProducts: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
      const mergedProducts = data.map(product => {
        const savedProduct = parsedProducts.find(p => p.id === product.id);
        return savedProduct ? { ...product, isWishlisted: savedProduct.isWishlisted } : { ...product, isWishlisted: false };
      });

      localStorage.setItem('products', JSON.stringify(mergedProducts));
      setBestSellers(mergedProducts);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      setError('Failed to load best sellers.');
    } finally {
      setLoading(false);
    }
  };

  fetchBestSellers();
}, [wishlistUpdate]);

const handleProductClick = (product: Product) => {
  setSelectedProduct(product);
};

const handleToggleWishlist = (e: React.MouseEvent, productId: number) => {
  e.stopPropagation();

  const storedProducts = localStorage.getItem('products');
  let parsedProducts: Product[] = storedProducts ? JSON.parse(storedProducts) : [];

  const productIndex = parsedProducts.findIndex(p => p.id === productId);

  if (productIndex !== -1) {
    parsedProducts[productIndex].isWishlisted = !parsedProducts[productIndex].isWishlisted;

    localStorage.setItem('products', JSON.stringify(parsedProducts));

    // Update bestSellers state (first 3 products) while preserving wishlist status
    const updatedBestsellers = parsedProducts.slice(0, 3);
    setBestSellers(updatedBestsellers);

    triggerWishlistUpdate();
  } else {
    console.warn(`Product with ID ${productId} not found in localStorage.`);
  }
};


if (loading) {
  return (
    <div className={styles.loadingContainer}> 
      <LoadingDots /> 
    </div>
  );
}

if (error) {
  return <div className={styles.error}>{error}</div>;
}

return (
    <section className={styles.bestSellers}>
      <h2 className={styles.bestSellersTitle}>Best Sellers</h2> 
      <div className={styles.productGrid}>
        {bestSellers.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onProductClick={handleProductClick}
            onToggleWishlist={handleToggleWishlist}
            wishlistUpdate={wishlistUpdate}
          />
        ))}
      </div>
      <ProductModal
      product={selectedProduct}
      onClose={() => setSelectedProduct(null)}
      onToggleWishlist={handleToggleWishlist}
    />
    </section>
  );
  };
  
  export default BestSellers;