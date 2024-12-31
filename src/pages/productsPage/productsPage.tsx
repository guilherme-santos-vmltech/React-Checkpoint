import React, { useState } from "react";
import styles from "./productsPage.module.css";
import { useWishlist } from "../../context/wishlistContext/wishlistContext.tsx";
import ProductModal from "../../components/productModal/productModal.tsx";
import ProductCard from "../../components/productCard/productCard.tsx";
import LoadingDots from "../../components/loadingDots/loadingDots.tsx";
import { useProducts } from "../../hooks/useProducts/useProducts.tsx";
import { Product } from "../../types/product.tsx";

const ProductsPage: React.FC = () => {
  const { wishlistUpdate } = useWishlist();
  const { products, loading, error, toggleWishlist } =
    useProducts(wishlistUpdate);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (loading) return <LoadingDots />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.productsPage}>
      <div className={styles.productsGrid}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onProductClick={setSelectedProduct}
            onToggleWishlist={toggleWishlist}
            wishlistUpdate={wishlistUpdate}
          />
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={toggleWishlist}
      />
    </div>
  );
};

export default ProductsPage;
