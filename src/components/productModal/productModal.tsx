import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./productModal.module.css";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onToggleWishlist: (e: React.MouseEvent, productId: number) => void;
}
const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onToggleWishlist,
}) => {
  if (!product) return null;

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.modalGrid}>
          <div className={styles.modalImageContainer}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.modalImage}
            />
          </div>

          <div className={styles.modalInfo}>
            <h2 className={styles.modalTitle}>{product.title}</h2>
            <p className={styles.modalCategory}>{product.category}</p>
            <p className={styles.modalPrice}>${product.price}</p>
            <p className={styles.modalDescription}>{product.description}</p>

            <div className={styles.actions}>
              <button className={styles.modalAddToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
