import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-red-800 py-4">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-wrap justify-between items-center text-xs text-gray-200">
        <p>© 2024 QuickCart</p>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/shop" className="hover:text-white">Shop</Link>
          <Link to="/about" className="hover:text-white">About</Link>
          <a href="mailto:support@quickcart.com" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 