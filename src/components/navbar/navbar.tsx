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
      <nav className={styles.navbar} aria-label="Main navigation">
        <ul className={styles.navLinks} aria-label="Primary navigation">
          <li>
            <Link to="/" className={styles.navLink} aria-label="Home page">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={styles.navLink}
              aria-label="Products page"
            >
              Products
            </Link>
          </li>
        </ul>

        <Link
          to="/"
          className={styles.logoContainer}
          aria-label="Home page via logo"
        >
          <img
            src={`${process.env.PUBLIC_URL}/img/logo.png`}
            alt="Company Logo"
            className={styles.logo}
          />
        </Link>

        <div
          className={styles.iconButtons}
          role="group"
          aria-label="Shopping actions"
        >
          <button
            className={styles.wishlistButton}
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Open Wishlist"
            aria-haspopup="dialog"
            aria-expanded={isWishlistOpen}
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={styles.wishlistIcon}
              aria-hidden="true"
            />
          </button>

          <button
            className={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open Cart with ${totalItems} items`}
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
          >
            <div className={styles.cartIconContainer} aria-hidden="true">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className={styles.cartIcon}
              />
              {totalItems > 0 ? (
                <span
                  className={styles.cartBadge}
                  role="status"
                  aria-live="polite"
                  aria-label={`${totalItems} items in cart`}
                >
                  {totalItems}
                </span>
              ) : (
                <span
                  role="status"
                  aria-live="polite"
                  aria-label="Cart is empty"
                >
                  
                </span>
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
