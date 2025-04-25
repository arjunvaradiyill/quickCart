// API base URL - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003';

/**
 * Create a new order
 * @param {Object} orderData - Order information with items, shipping, payment details
 * @returns {Promise} - Promise containing order details and Stripe payment intent data
 */
export const createOrder = async (orderData) => {
  try {
    console.log('Preparing to create order with data:', {
      itemCount: orderData.orderItems?.length,
      total: orderData.totalPrice
    });
    
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
      throw new Error('You must be logged in to place an order');
    }
    
    console.log('Making API request to create order...');
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Server error response:', responseData);
      throw new Error(responseData.message || `Failed with status: ${response.status}`);
    }
    
    console.log('Order created successfully:', responseData.order?._id);
    return responseData;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

/**
 * Update order to paid status
 * @param {String} orderId - ID of the order
 * @param {Object} paymentResult - Payment verification data from Stripe
 * @returns {Promise} - Promise containing updated order details
 */
export const updateOrderToPaid = async (orderId, paymentResult) => {
  try {
    // Get token from localStorage
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
      throw new Error('You must be logged in to update an order');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentResult),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update order payment error:', error);
    throw error;
  }
};

/**
 * Get a specific order by ID
 * @param {String} orderId - ID of the order to retrieve
 * @returns {Promise} - Promise containing order details
 */
export const getOrderById = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    
    // Get token from localStorage
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
      throw new Error('You must be logged in to view order details');
    }
    
    console.log(`Fetching order details for ID: ${orderId}`);
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data._id) {
      throw new Error('Invalid order data received from server');
    }
    
    console.log(`Successfully retrieved order with ID: ${data._id}`);
    return data;
  } catch (error) {
    console.error('Get order details error:', error);
    throw error;
  }
};

/**
 * Get all orders for the logged-in user
 * @returns {Promise} - Promise containing array of orders
 */
export const getMyOrders = async () => {
  try {
    // Get token from localStorage
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
      throw new Error('You must be logged in to view your orders');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get my orders error:', error);
    throw error;
  }
}; 