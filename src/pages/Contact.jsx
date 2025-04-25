import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-red-700">Contact QuickCart</h1>
      {submitted ? <p className="text-center p-2 bg-green-100 rounded">Message sent!</p> : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" required value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500" />
          <input type="email" placeholder="Email" required value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500" />
          <textarea placeholder="Message" required value={formData.message} rows="3"
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500" />
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700">Send</button>
        </form>
      )}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>QuickCart Support: support@quickcart.com | Phone: (555) 123-4567</p>
      </div>
    </div>
  );
};

export default Contact; 