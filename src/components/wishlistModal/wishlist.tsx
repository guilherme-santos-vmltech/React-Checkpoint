import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./wishlist.module.css";
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

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
  const { triggerWishlistUpdate } = useWishlist();

  // Load wishlisted items when modal opens
  useEffect(() => {
    if (isOpen) {
      loadWishlistedItems();
    }
  }, [isOpen]);

  const loadWishlistedItems = () => {
    const products = localStorage.getItem("products");
    if (products) {
      const parsedProducts: Product[] = JSON.parse(products);
      const wishlisted = parsedProducts.filter(
        (product) => product.isWishlisted
      );
      setWishlistedProducts(wishlisted);
    }
  };

  const removeFromWishlist = (productId: number) => {
    const products = localStorage.getItem("products");
    if (products) {
      const parsedProducts: Product[] = JSON.parse(products);
      const updatedProducts = parsedProducts.map((product) =>
        product.id === productId ? { ...product, isWishlisted: false } : product
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    }

    setWishlistedProducts((current) =>
      current.filter((product) => product.id !== productId)
    );

    // Trigger update for ProductsPage
    triggerWishlistUpdate();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>
            My Wishlist{" "}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className={styles.modalContent}>
          {wishlistedProducts.length === 0 ? (
            <div className={styles.emptyWishlist}>
              <p>Your wishlist is empty</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {wishlistedProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className={styles.productImage}
                    />
                    <button
                      className={styles.removeButton}
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <p className={styles.productPrice}>${product.price}</p>
                    <button className={styles.addToCartButton}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistModal;
