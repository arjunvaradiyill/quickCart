import React from 'react'
import NavBar from './components/NavBar.jsx'
import Carousel from './components/Carousel.jsx'
import Products from './components/Products.jsx'
import Cart from './components/Cart.jsx'
import Shop from './components/Shop.jsx'
import ProductDetails from './components/ProductDetails.jsx'
import { CartProvider } from './components/CartContext.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import { Routes, Route } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import LoginPage from './pages/LoginPage'
import './index.css'


const App = () => (
  <AuthProvider>
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <Cart />
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Carousel />
                  <Products />
                </>
              } 
            />
            {/* routes */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order/:id" element={<OrderDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  </AuthProvider>
);




export default App