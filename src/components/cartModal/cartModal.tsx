import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/cartContext/cartContext.tsx';
import styles from './cartModal.module.css';

interface CartModalProps {
isOpen: boolean;
onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

if (!isOpen) return null;

return (
  <div className={styles.modalContainer}>
    <div className={styles.modalOverlay} onClick={onClose} />
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <h2 className={styles.title}>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Your cart is empty</p>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.title} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemPrice}>${item.price}</p>
                </div>
                <div className={styles.quantityControls}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className={styles.quantityButton}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className={styles.quantityButton}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.cartFooter}>
            <div className={styles.total}>
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <button className={styles.checkoutButton}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default CartModal;