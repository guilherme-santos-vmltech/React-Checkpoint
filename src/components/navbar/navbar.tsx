import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./navbar.module.css";
import WishlistModal from "../wishlistModal/wishlist.tsx";
import { useCart } from "../../context/cartContext/cartContext.tsx";
import CartModal from "../cartModal/cartModal.tsx";

const Navbar: React.FC = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          Your Logo
        </Link>
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
          <li>
            <button
              className={styles.wishlistButton}
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Open Wishlist"
            >
              Whishlist
              <FontAwesomeIcon icon={faHeart} className={styles.wishlistIcon} />
            </button>
            <button onClick={() => setIsCartOpen(true)}>
              Cart ({cartItems.length})
            </button>
          </li>
        </ul>
      </nav>

      <CartModal 
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
    />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;
