import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LoginModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();

  // Update isRegister when initialMode changes
  useEffect(() => {
    setIsRegister(initialMode === 'register');
  }, [initialMode]);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setSuccessMessage('');
      setError('');
    }
  }, [isOpen, isRegister]);

  const validateForm = () => {
    // Reset errors
    setPasswordError('');
    setError('');
    
    // Validate password match for registration
    if (isRegister && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    // Validate password length
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isRegister) {
        // Register new user
        register({
          name,
          email,
          id: Date.now().toString(), // mock user ID
        });
        setSuccessMessage('Registration successful! Please login with your credentials.');
        
        // Switch to login mode after successful registration
        setTimeout(() => {
          setIsRegister(false);
          setSuccessMessage('');
          // Clear registration fields
          setName('');
          setConfirmPassword('');
        }, 1500);
      } else {
        // Login user
        login({
          name: email.split('@')[0], // Mock name from email
          email,
          id: Date.now().toString(), // mock user ID
        });
        setSuccessMessage('Login successful! Welcome back!');
        
        // Close modal after successful login
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-5 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              {isRegister ? 'Create Account' : 'Sign In'}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          {/* Success Message */}
          {successMessage && (
            <div className="m-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="m-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Modal Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Name Field (for Register only) */}
              {isRegister && (
                <div className="mb-4">
                  <label 
                    htmlFor="name" 
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="John Doe" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              
              {/* Email Field */}
              <div className="mb-4">
                <label 
                  htmlFor="email" 
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  placeholder="name@example.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              {/* Password Field */}
              <div className="mb-4">
                <label 
                  htmlFor="password" 
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input 
                  type="password" 
                  id="password" 
                  className={`bg-gray-50 border ${passwordError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
              
              {/* Confirm Password Field (for Register) */}
              {isRegister && (
                <div className="mb-4">
                  <label 
                    htmlFor="confirm-password" 
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Confirm Password
                  </label>
                  <input 
                    type="password" 
                    id="confirm-password" 
                    className={`bg-gray-50 border ${passwordError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                  )}
                </div>
              )}
              
              {/* Remember Me Checkbox */}
              {!isRegister && (
                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input 
                      id="remember" 
                      type="checkbox" 
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  </div>
                  <label 
                    htmlFor="remember" 
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
              )}
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            
            {/* Forgot Password */}
            {!isRegister && (
              <div className="text-sm font-medium text-gray-500 mt-3 text-center">
                <a href="#" className="text-blue-700 hover:underline">Forgot Password?</a>
              </div>
            )}
            
            
            {/* Toggle between Login and Register */}
            <div className="text-sm font-medium text-gray-500 mt-4 text-center">
              {isRegister ? (
                <>
                  Already have an account? <button type="button" className="text-blue-700 hover:underline" onClick={() => setIsRegister(false)}>Sign in</button>
                </>
              ) : (
                <>
                  Not registered? <button type="button" className="text-blue-700 hover:underline" onClick={() => setIsRegister(true)}>Create account</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal; 