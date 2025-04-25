import React, { useState, useEffect } from 'react'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
import { Link } from 'react-router-dom'
import LoginModal from './LoginModal'

const Shop = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedToCart, setAddedToCart] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Helper function to get product ID consistently
  const getProductId = (product) => {
    return product.id || product._id;
  };

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
        if (sortOption !== 'default') queryParams.append('sort', sortOption);
        if (searchTerm) queryParams.append('keyword', searchTerm);

        const response = await fetch(`http://localhost:8003/api/products?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        setTotalPages(data.pages);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [page, selectedCategory, sortOption, searchTerm]);

  // Fetch categories for the filter
  const [categories, setCategories] = useState(['All']);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(['All', ...data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleAddToCart = (product) => {
    const productId = getProductId(product);
    
    if (!isAuthenticated) {
      setShowLoginPrompt(productId);
      setShowLoginModal(true);
      
      setTimeout(() => {
        setShowLoginPrompt(null);
      }, 3000);
      return;
    }
    
    addToCart(product);
    setAddedToCart(productId);
    
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-700">QuickCart Products</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  {/* Category filter */}
                  <div className="min-w-48">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                    <select 
                      id="category" 
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setPage(1); // Reset to first page when changing category
                      }}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Sort options */}
                  <div className="min-w-48">
                    <label htmlFor="sort" className="block mb-2 text-sm font-medium text-gray-700">Sort by</label>
                    <select 
                      id="sort" 
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={sortOption}
                      onChange={(e) => {
                        setSortOption(e.target.value);
                        setPage(1); // Reset to first page when changing sort
                      }}
                    >
                      <option value="default">Default</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>
                
                {/* Search bar */}
                <div className="w-full md:w-auto md:min-w-64">
                  <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-700">Search products</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <input 
                      type="search" 
                      id="search" 
                      className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1); // Reset to first page when searching
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">No products found. Try a different search or filter.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => {
                    const productId = getProductId(product);
                    return (
                      <div key={productId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                        <Link to={`/product/${productId}`} className="block flex-shrink-0">
                          <div className="h-64 w-full overflow-hidden relative">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-contain object-center p-2 hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4 h-32 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2 whitespace-nowrap">{product.category}</span>
                            </div>
                            <div className="flex items-center mb-2 mt-auto">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  aria-hidden="true" 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  fill="currentColor" 
                                  viewBox="0 0 22 20"
                                >
                                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                              ))}
                              <span className="ml-1 text-sm text-gray-500">{product.rating}/5</span>
                            </div>
                          </div>
                        </Link>
                        <div className="px-4 pb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                            <button 
                              onClick={() => handleAddToCart(product)}
                              className={`text-white font-medium rounded-lg text-sm px-3 py-2 text-center transition-all duration-300 
                                ${addedToCart === productId 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : showLoginPrompt === productId
                                    ? 'bg-yellow-600 hover:bg-yellow-700'
                                    : 'bg-red-700 hover:bg-red-800'} 
                                focus:ring-4 focus:ring-red-300`}
                            >
                              {addedToCart === productId 
                                ? 'Added!' 
                                : showLoginPrompt === productId
                                  ? 'Login Required'
                                  : 'Add to cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav aria-label="Page navigation">
                      <ul className="flex items-center -space-x-px h-10 text-base">
                        <li>
                          <button
                            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${page === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                            </svg>
                          </button>
                        </li>
                        
                        {[...Array(totalPages)].map((_, index) => (
                          <li key={index}>
                            <button
                              className={`flex items-center justify-center px-4 h-10 leading-tight ${page === index + 1 ? 'text-red-600 border border-red-300 bg-red-50 hover:bg-red-100 hover:text-red-700' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`}
                              onClick={() => setPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        
                        <li>
                          <button
                            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${page === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                          >
                            <span className="sr-only">Next</span>
                            <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal} 
        initialMode="login"
      />
    </div>
  )
}

export default Shop 