import React, { useEffect, useState } from "react";
import styles from "./productsPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartSolid,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useWishlist } from "../../context/wishlistContext/wishlistContext.tsx";



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
  const [products, setProducts] = useState<Product[]>([]);
  const { wishlistUpdate } = useWishlist();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  

  useEffect(() => {
    // Create and add preload link
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href =
      "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg";
    preloadLink.fetchPriority = "high";
    document.head.appendChild(preloadLink);

    // Cleanup function to remove preload link when component unmounts
    return () => {
      if (preloadLink && document.head.contains(preloadLink)) {
        document.head.removeChild(preloadLink);
      }
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [wishlistUpdate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();

      // Initialize products with isWishlisted property
      const productsWithWishlist = data.map((product: Product) => ({
        ...product,
        isWishlisted: false,
      }));

      // Get existing wishlist state
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        productsWithWishlist.forEach((product: Product) => {
          const savedProduct = parsedProducts.find(
            (p: Product) => p.id === product.id
          );
          if (savedProduct) {
            product.isWishlisted = savedProduct.isWishlisted;
          }
        });
      }

      setProducts(productsWithWishlist);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const toggleWishlist = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation(); // Prevent modal from opening when clicking wishlist button
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      );

      // Save to localStorage
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      return updatedProducts;
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading
        <span className={styles.dot1}>.</span>
        <span className={styles.dot2}>.</span>
        <span className={styles.dot3}>.</span>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.productsPage}>
      <h1 className={styles.title}>Our Products</h1>
      <div className={styles.productsGrid}>
        {products.map((product, index) => (
          <div
            key={product.id}
            className={styles.productCard}
            onClick={() => handleProductClick(product)}
          >
            <div className={styles.imageContainer}>
              <img
                src={product.image}
                alt={product.title}
                className={styles.productImage}
                loading='eager'
              />
              <button
                className={styles.wishlistButton}
                onClick={(e) => toggleWishlist(e, product.id)}
                aria-label={
                  product.isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <FontAwesomeIcon
                  icon={product.isWishlisted ? faHeartSolid : faHeartRegular}
                  className={`${styles.heartIcon} ${
                    product.isWishlisted ? styles.wishlisted : ""
                  }`}
                />
              </button>
            </div>
            <div className={styles.productInfo}>
              <h2 className={styles.productTitle}>{product.title}</h2>
              <p className={styles.productCategory}>{product.category}</p>
              <p className={styles.productPrice}>${product.price}</p>
              <p className={styles.productDescription}>
                {product.description.slice(0, 100)}...
              </p>
              <button
                className={styles.addToCartButton}
                onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking Add to Cart
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <>
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedProduct(null)}
          />
          <div className={styles.modalContent}>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedProduct(null)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.modalImageContainer}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className={styles.modalImage}
                />
              </div>

              <div className={styles.modalInfo}>
                <h2 className={styles.modalTitle}>{selectedProduct.title}</h2>
                <p className={styles.modalCategory}>
                  {selectedProduct.category}
                </p>
                <p className={styles.modalPrice}>${selectedProduct.price}</p>
                <p className={styles.modalDescription}>
                  {selectedProduct.description}
                </p>
                <button className={styles.modalAddToCart}>Add to Cart</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
