import React, { createContext, useContext, useState } from 'react';
import { Product } from '../../types/product';

interface CartItem extends Product {
quantity: number;
}

interface CartContextType {
cartItems: CartItem[];
addToCart: (product: Product) => void;
removeFromCart: (productId: number) => void;
updateQuantity: (productId: number, quantity: number) => void;
clearCart: () => void;
getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [cartItems, setCartItems] = useState<CartItem[]>([]);

const addToCart = (product: Product) => {
  setCartItems(prevItems => {
    const existingItem = prevItems.find(item => item.id === product.id);
    
    if (existingItem) {
      return prevItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prevItems, { ...product, quantity: 1 }];
  });
};

const removeFromCart = (productId: number) => {
  setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
};

const updateQuantity = (productId: number, quantity: number) => {
  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }

  setCartItems(prevItems =>
    prevItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    )
  );
};

const clearCart = () => {
  setCartItems([]);
};

const getCartTotal = () => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

return (
  <CartContext.Provider value={{
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  }}>
    {children}
  </CartContext.Provider>
);
};

export const useCart = () => {
const context = useContext(CartContext);
if (context === undefined) {
  throw new Error('useCart must be used within a CartProvider');
}
return context;
};