import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderToPaid } from '../services/orderService';
import { useAuth } from '../components/AuthContext';
import { createRazorpayOrder } from '../services/paymentService';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/order/${id}` } });
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load order");
        setLoading(false);
      }
    };

    fetchOrder();
    
    // Load Razorpay script when component mounts
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [id, isAuthenticated, navigate]);

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please refresh the page and try again.");
      }
      
      // First create an order on the server
      const orderAmount = Math.round(order.totalPrice * 100); // Amount in paisa
      const orderData = {
        amount: orderAmount,
        currency: "INR",
        receipt: order._id
      };
      
      // Create Razorpay order
      const response = await createRazorpayOrder(orderData);
      console.log('Razorpay order response:', response);
      
      if (!response || !response.order || !response.order.id) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: response.key_id || "rzp_test_IuMAdXrnMrVoQM", // Use key from server response or fallback
        amount: orderAmount,
        currency: "INR",
        name: "QuickCart Store",
        description: `Payment for Order #${order._id.substring(order._id.length - 6).toUpperCase()}`,
        order_id: response.order.id,
        handler: async function(paymentResponse) {
          try {
            console.log('Payment successful, processing...', paymentResponse);
            
            // Create payment result for verification
            const paymentResult = {
              payment_intent_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              status: 'succeeded',
              updated_at: new Date().toISOString()
            };
            
            // Update order payment status
            console.log('Updating order payment status with:', paymentResult);
            const updatedOrder = await updateOrderToPaid(order._id, paymentResult);
            setOrder(updatedOrder);
            alert("Payment successful! Your order has been paid.");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: order.user?.name || "",
          email: order.user?.email || "",
          contact: ""
        },
        notes: {
          order_id: order._id
        },
        theme: {
          color: "#dc2626"
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };
      
      // Create and open Razorpay checkout
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message || "An error occurred. Please try again.");
      setPaymentLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
          <Link
            to="/orders"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p>Order not found</p>
          </div>
          <Link
            to="/orders"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order #{order._id.substring(order._id.length - 6).toUpperCase()}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Placed on {formatDate(order.createdAt)}
        </p>

        {/* Order Status */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                <div className="mt-1 flex items-center">
                  {order.isPaid ? (
                    <>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                        Paid
                      </span>
                      <span className="text-sm text-gray-700">
                        on {formatDate(order.paidAt)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                        Pending
                      </span>
                      <button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className={`ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed`}
                      >
                        {paymentLoading ? 'Processing...' : 'Pay Now'}
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Delivery Status</h3>
                <div className="mt-1">
                  {order.isDelivered ? (
                    <>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                        Delivered
                      </span>
                      <span className="text-sm text-gray-700">
                        on {formatDate(order.deliveredAt)}
                      </span>
                    </>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Processing
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {order.orderItems.map((item) => (
                <li key={item._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 overflow-hidden rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500">
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Items Price</dt>
                <dd className="mt-1 text-sm text-gray-900">${order.itemsPrice.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                <dd className="mt-1 text-sm text-gray-900">${order.shippingPrice.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tax</dt>
                <dd className="mt-1 text-sm text-gray-900">${order.taxPrice.toFixed(2)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="mt-1 text-base font-medium text-gray-900">${order.totalPrice.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-8">
          <Link
            to="/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 