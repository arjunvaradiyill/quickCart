import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import LoginModal from './LoginModal';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sample additional images (in real app, these would come from the backend)
  const [productImages, setProductImages] = useState([]);

  // Helper function to get product ID consistently
  const getProductId = (product) => {
    return product.id || product._id;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Use images from database if available, otherwise use main image
        if (data.images && data.images.length > 0) {
          setProductImages(data.images);
        } else {
          // Fallback to using just the main image
          setProductImages([data.image]);
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setLoginRequired(true);
      setShowLoginModal(true);
      
      // Reset login required message after 3 seconds
      setTimeout(() => {
        setLoginRequired(false);
      }, 3000);
      return;
    }
    
    if (product) {
      // Ensure product has a consistent id field
      const enhancedProduct = {
        ...product,
        id: getProductId(product)
      };
      
      // Add to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(enhancedProduct);
      }
      setAddedToCart(true);
      
      // Reset added to cart message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-lg text-gray-600 mb-4">Product not found</div>
          <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-9-9-9 9 1.414 1.414L10 3.828l6.879 6.879 1.414-1.414Z"/>
                <path d="M10 6.414 2.929 13.485a.5.5 0 0 0-.145.353v2.949A2.2 2.2 0 0 0 5 19h3v-5h4v5h3a2.2 2.2 0 0 0 2.217-2.212v-2.949a.5.5 0 0 0-.145-.353L10 6.414Z"/>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <Link to="/shop" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">Shop</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 line-clamp-1">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product images section */}
        <div className="md:w-1/2">
          {/* Main product image */}
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 h-[400px] flex items-center justify-center bg-white">
            <img 
              src={productImages[activeImage]} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain p-4"
            />
          </div>
          
          {/* Thumbnail gallery */}
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <div 
                key={index} 
                className={`cursor-pointer h-24 rounded-md overflow-hidden border-2 ${index === activeImage ? 'border-blue-500' : 'border-gray-200'} flex items-center justify-center bg-white`}
                onClick={() => setActiveImage(index)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} className="max-w-full max-h-full object-contain p-1" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product details section */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="currentColor" 
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating}/5 ({product.numReviews} reviews)</span>
          </div>
          
          <div className="flex items-center mb-6">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <span className="ml-2 text-sm text-gray-500">{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block mb-6">
            {product.category}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {product.brand && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Brand</h2>
              <p className="text-gray-700">{product.brand}</p>
            </div>
          )}
          
          {product.countInStock > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Quantity</h2>
              <div className="flex items-center">
                <button 
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-lg"
                  onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                >-</button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.countInStock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center py-1 border-y border-gray-200"
                />
                <button 
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-lg"
                  onClick={() => setQuantity(prev => Math.min(prev + 1, product.countInStock))}
                >+</button>
                <span className="ml-2 text-sm text-gray-500">
                  {product.countInStock} available
                </span>
              </div>
            </div>
          )}
          
          {loginRequired && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              Please log in to add items to your cart
            </div>
          )}
          
          {addedToCart && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
              Item added to your cart!
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                product.countInStock === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : loginRequired
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {product.countInStock === 0 
                ? 'Out of Stock' 
                : loginRequired 
                  ? 'Login Required' 
                  : 'Add to Cart'}
            </button>
            
            <Link 
              to="/shop" 
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal} 
        initialMode="login"
      />
    </div>
  );
};

export default ProductDetails; 