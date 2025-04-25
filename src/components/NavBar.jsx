import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const NavBar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount, toggleCart } = useCart();

  const handleCartClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    toggleCart();
  };

  return (
    <>
      <nav className="bg-red-700 text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            QuickCart
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-200 transition">
              Home
            </Link>
            <Link to="/shop" className="hover:text-gray-200 transition">
              Shop
            </Link>
            <Link to="/about" className="hover:text-gray-200 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-gray-200 transition">
              Contact
            </Link>
          </div>

          <div className="flex space-x-4 items-center">
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative p-1 hover:text-gray-200 transition"
              aria-label="Shopping Cart"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              {itemCount > 0 && isAuthenticated && (
                <span className="absolute -top-2 -right-2 bg-white text-red-700 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center">
                    <span className="text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:inline-block">{user.name}</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginModalOpen(true);
                    setIsRegisterMode(false);
                  }}
                  className="hover:text-gray-200"
                >
                  Login
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginModalOpen(true);
                    setIsRegisterMode(true);
                  }}
                  className="bg-white text-red-700 hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                  Register
                </a>
              </>
            )}
            <button className="md:hidden">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialMode={isRegisterMode ? "register" : "login"}
      />
    </>
  );
};

export default NavBar;
