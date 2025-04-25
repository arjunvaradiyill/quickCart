import React, { createContext, useState, useContext } from "react";

// Create a context for the cart
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toggle cart open/close
  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Add an item to cart
  const addToCart = (product) => {
    // Normalize product structure to ensure it has a consistent id field
    const normalizedProduct = {
      ...product,
      id: product.id || product._id, // Use product.id if it exists, otherwise use product._id
    };

    setCartItems((prev) => {
      // Check if the item is already in the cart
      const existingItem = prev.find(
        (item) =>
          item.id === normalizedProduct.id ||
          (item._id && item._id === normalizedProduct._id),
      );

      if (existingItem) {
        // Increase quantity if item already exists
        return prev.map((item) =>
          item.id === normalizedProduct.id ||
          (item._id && item._id === normalizedProduct._id)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Add new item with quantity 1
        return [...prev, { ...normalizedProduct, quantity: 1 }];
      }
    });
  };

  // Remove an item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== productId && (item._id ? item._id !== productId : true),
      ),
    );
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId || (item._id && item._id === productId)
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Get total number of items in cart
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Value to be provided to consumers
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    isCartOpen,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
