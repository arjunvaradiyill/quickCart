// API base URL - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003';

/**
 * Create a Razorpay order
 * @param {Object} orderData - Order data containing amount, currency, etc.
 * @returns {Promise} - Promise containing order details
 */
export const createRazorpayOrder = async (orderData) => {
  try {
    // Get token from localStorage (either directly or from user object)
    let token = localStorage.getItem('token');
    
    // If no direct token, try to get it from the user object
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token;
      }
    }
    
    if (!token) {
      throw new Error('You must be logged in to checkout');
    }
    
    console.log('Creating Razorpay order with data:', orderData);
    
    const response = await fetch(`${API_BASE_URL}/api/payment/create-razorpay-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        receipt: orderData.receipt || `receipt_${Date.now()}`,
        notes: orderData.notes || {
          source: 'ecommerce-website'
        }
      }),
    });
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `Failed with status: ${response.status}`;
      } catch (e) {
        errorMessage = `Request failed with status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Razorpay order created successfully:', data);
    return data;
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment
 * @param {Object} paymentData - Payment data returned by Razorpay
 * @returns {Promise} - Promise containing verification result
 */
export const verifyPayment = async (paymentData) => {
  try {
    // Get token from localStorage (either directly or from user object)
    let token = localStorage.getItem('token');
    
    // If no direct token, try to get it from the user object
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token;
      }
    }
    
    if (!token) {
      throw new Error('You must be logged in to verify payment');
    }
    
    console.log('Verifying Razorpay payment:', paymentData);
    
    const response = await fetch(`${API_BASE_URL}/api/payment/verify-upi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `Failed with status: ${response.status}`;
      } catch (e) {
        errorMessage = `Request failed with status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Payment verification successful:', data);
    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

/**
 * Get payment details
 * @param {String} paymentId - Razorpay payment ID
 * @returns {Promise} - Promise containing payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    // Get token from localStorage (either directly or from user object)
    let token = localStorage.getItem('token');
    
    // If no direct token, try to get it from the user object
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token;
      }
    }
    
    if (!token) {
      throw new Error('You must be logged in to get payment details');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get payment details error:', error);
    throw error;
  }
}; 