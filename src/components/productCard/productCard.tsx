import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import styles from './productCard.module.css';
import { useCart } from '../../context/cartContext/cartContext.tsx';
import { Product } from "../../types/product.tsx"


interface ProductCardProps {
product: Product;
index: number;
onProductClick: (product: Product) => void;
onToggleWishlist: (e: React.MouseEvent, productId: number) => void;
wishlistUpdate: number;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onProductClick,
  onToggleWishlist,
  }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    
  };
  
  return (
    <div 
      className={styles.productCard}
      onClick={() => onProductClick(product)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.title}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.productImage}
          loading={index === 0 ? "eager" : "lazy"}
          width="300"
          height="300"
        />
        <button
          className={styles.wishlistButton}
          onClick={(e) => onToggleWishlist(e, product.id)}
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
            aria-hidden="true"
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
          onClick={handleAddToCart}
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
  };

  export default ProductCard