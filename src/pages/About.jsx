import React from 'react';

const About = () => (
  <div className="max-w-[1400px] mx-auto p-4 py-12">
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold mb-4 text-red-700">About QuickCart</h1>
      <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Your premium destination for global products, delivered with exceptional service and sustainable practices.
      </p>
    </div>
    
    <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
      <div className="md:w-1/2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Founded in 2024, QuickCart connects customers with premium products globally. We focus on electronics, fashion, and home essentials with exceptional service and sustainable practices.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">Our Approach</h2>
          <p className="text-gray-700 leading-relaxed">
            We offer global shipping, secure transactions, 30-day returns, 24/7 support, eco-friendly packaging, and a loyalty program for our valued customers.
          </p>
        </div>
      </div>
      
      <div className="md:w-1/2">
        <img 
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" 
          alt="QuickCart" 
          className="rounded-lg shadow-lg w-full h-auto object-cover"
        />
      </div>
    </div>
    
    
  </div>
);

export default About; 