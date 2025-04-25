import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import LoginModal from "./LoginModal";
import { createOrder } from "../services/orderService";
import { updateOrderToPaid } from "../services/orderService";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    isCartOpen,
    toggleCart,
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  // Helper function to get the item ID (either id or _id)
  const getItemId = (item) => {
    return item.id || item._id;
  };

  // Load Stripe.js
  const loadStripe = () => {
    return new Promise((resolve) => {
      if (window.Stripe) {
        resolve(window.Stripe);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        resolve(window.Stripe);
      };
      script.onerror = () => {
        console.error('Stripe SDK failed to load');
        resolve(null);
      };
      document.body.appendChild(script);
    });
  };

  // Handle checkout process
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setCheckoutError("You need to be logged in to checkout. Please login.");
      setShowLoginModal(true);
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty. Add items before checkout.");
      return;
    }

    try {
      setIsProcessing(true);
      setCheckoutError(null);
      
      // Create order items from cart
      const orderItems = cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: getItemId(item),
      }));
      
      // Default shipping address (can be replaced with form input)
      const shippingAddress = {
        address: '123 Example St',
        city: 'Test City',
        postalCode: '12345',
        country: 'India',
      };
      
      // Create order in the backend
      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod: 'Stripe',
        itemsPrice: cartTotal,
        shippingPrice: 0, // Free shipping for now
        taxPrice: 0, // No tax for now
        totalPrice: cartTotal,
      };

      console.log('Submitting order with total price:', cartTotal);
      
      try {
        // Create order on the server
        const result = await createOrder(orderData);
        
        console.log('Order created successfully:', result);
        
        if (!result || !result.order || !result.order._id) {
          console.error('Invalid order response:', result);
          setCheckoutError("Failed to create order. The server response was invalid.");
          setIsProcessing(false);
          return;
        }
        
        const orderId = result.order._id;
        console.log('Order created:', orderId);
        
        // Close cart drawer
        toggleCart();
        
        // Show success alert and redirect to orders page
        alert(`Order created successfully! Order ID: ${orderId}`);
        window.location.href = `/order/${orderId}`;
        
      } catch (orderError) {
        console.error("Order creation failed:", orderError);
        
        // Handle specific error cases
        if (orderError.message && orderError.message.includes('Authentication')) {
          setCheckoutError("Your session has expired. Please log in again.");
          setShowLoginModal(true);
        } else if (orderError.message && orderError.message.includes('Payment gateway')) {
          setCheckoutError("Payment system error. Please try again later or contact support.");
        } else {
          setCheckoutError(orderError.message || "Failed to create order. Please try again.");
        }
        
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError(error.message || "An unexpected error occurred during checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Close cart if user logs out
    if (!isAuthenticated && isCartOpen) {
      toggleCart();
    }
  }, [isAuthenticated, isCartOpen, toggleCart]);

  if (cartItems.length === 0 && isCartOpen) {
    return (
      <>
        <div className="fixed top-0 right-0 z-50 h-screen w-80 bg-white shadow-lg p-4 transform transition-transform duration-300">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-64">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button
              onClick={toggleCart}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseLoginModal}
          initialMode="login"
        />
      </>
    );
  }

  return (
    <>
      {/* Cart sidebar */}
      {isCartOpen && (
        <div className="fixed top-0 right-0 z-40 h-screen w-80 bg-white shadow-lg p-4 transform transition-transform duration-300">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-xl font-bold">Your Cart ({itemCount} items)</h2>
            <button
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-230px)]">
            {cartItems.map((item) => (
              <div key={getItemId(item)} className="flex py-4 border-b">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.name}</h3>
                      <p className="ml-4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.category}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateQuantity(getItemId(item), item.quantity - 1)
                        }
                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                      <p className="text-gray-500 mx-2">Qty {item.quantity}</p>
                      <button
                        onClick={() =>
                          updateQuantity(getItemId(item), item.quantity + 1)
                        }
                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(getItemId(item))}
                      className="font-medium text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4">
            {checkoutError && (
              <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-md text-sm">
                {checkoutError}
              </div>
            )}
            
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isProcessing}
              >
                Clear Cart
              </button>
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleCart}
        ></div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        initialMode="login"
      />
    </>
  );
};

export default Cart;
