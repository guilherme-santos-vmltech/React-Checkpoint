import React, { useState } from "react";
import styles from "./productsPage.module.css";
import { useWishlist } from "../../context/wishlistContext/wishlistContext.tsx";
import ProductModal from "../../components/productModal/productModal.tsx";
import ProductCard from "../../components/productCard/productCard.tsx";
import LoadingDots from "../../components/loadingDots/loadingDots.tsx";
import { useProducts } from "../../hooks/useProducts/useProducts.tsx";
import { usePreloadImage } from "../../hooks/usePreloadImage/usePreloadImage.tsx";

interface Product {
id: number;
title: string;
price: number;
description: string;
image: string;
category: string;
isWishlisted: boolean;
}

const ProductsPage: React.FC = () => {
const { wishlistUpdate } = useWishlist();
const { products, loading, error, toggleWishlist } = useProducts(wishlistUpdate);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

usePreloadImage("https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg");
usePreloadImage("https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg");

if (loading) return <LoadingDots />;
if (error) return <div className={styles.error}>{error}</div>;

return (
  <div className={styles.productsPage}>
    <h1 className={styles.title}>Our Products</h1>
    <div className={styles.productsGrid}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onProductClick={setSelectedProduct}
          onToggleWishlist={toggleWishlist}
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