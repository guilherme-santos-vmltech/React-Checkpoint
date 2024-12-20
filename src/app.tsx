import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage/homePage.tsx";
import ProductsPage from "./pages/productsPage/productsPage.tsx";
import Layout from "./components/layout/layout.tsx";
import { WishlistProvider } from "./context/wishlistContext/wishlistContext.tsx";
import { CartProvider } from './context/cartContext/cartContext.tsx';
import './styles/global.css';



function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
            </Routes>
          </Layout>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
