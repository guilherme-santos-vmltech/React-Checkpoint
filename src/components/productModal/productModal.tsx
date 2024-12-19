import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './productModal.module.css';

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
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
if (!product) return null;

return (
  <>
    <div className={styles.overlay} onClick={onClose} />
    <div className={styles.modal}>
      <button className={styles.closeButton} onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img 
            src={product.image} 
            alt={product.title} 
            className={styles.image}
          />
        </div>
        
        <div className={styles.details}>
          <h2 className={styles.title}>{product.title}</h2>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.price}>${product.price}</p>
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.actions}>
            <button className={styles.addToCartButton}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default ProductModal;