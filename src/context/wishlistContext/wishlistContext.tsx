import React, { createContext, useContext, useState } from 'react';

interface WishlistContextType {
wishlistUpdate: number;
triggerWishlistUpdate: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [wishlistUpdate, setWishlistUpdate] = useState(0);

const triggerWishlistUpdate = () => {
  setWishlistUpdate(prev => prev + 1);
};

return (
  <WishlistContext.Provider value={{ wishlistUpdate, triggerWishlistUpdate }}>
    {children}
  </WishlistContext.Provider>
);
};

export const useWishlist = () => {
const context = useContext(WishlistContext);
if (!context) {
  throw new Error('useWishlist must be used within a WishlistProvider');
}
return context;
};