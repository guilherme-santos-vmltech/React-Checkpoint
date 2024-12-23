import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import styles from "./navbar.module.css";
import WishlistModal from "../wishlistModal/wishlist.tsx";
import { useCart } from "../../context/cartContext/cartContext.tsx";
import CartModal from "../cartModal/cartModal.tsx";



const Navbar: React.FC = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();



  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className={styles.navLink}>
              Products
            </Link>
          </li>
        </ul>
    
        <Link to="/" className={styles.logoContainer}>
          <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="Logo" className={styles.logo} />
        </Link>

        <div className={styles.iconButtons}>
          <button
            className={styles.wishlistButton}
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Open Wishlist"
          >
            <FontAwesomeIcon icon={faHeart} className={styles.wishlistIcon} />
            
          </button>

          <button
            className={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
          >
            <div className={styles.cartIconContainer}>
              <FontAwesomeIcon
                icon={faShoppingCart}
                className={styles.cartIcon}
              />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </div>
          </button>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;
