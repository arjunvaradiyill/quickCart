import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they were trying to access, or home
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

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
        
        // Redirect after successful login
        setTimeout(() => {
          const from = location.state?.from || '/';
          navigate(from, { replace: true });
        }, 1500);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12 bg-gray-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Form Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h1>
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
        
        {/* Form Body */}
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
            
            {/* Confirm Password Field (for Register only) */}
            {isRegister && (
              <div className="mb-4">
                <label 
                  htmlFor="confirmPassword" 
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  className={`bg-gray-50 border ${passwordError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`} 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            
            {/* Remember Me Checkbox (for Login only) */}
            {!isRegister && (
              <div className="flex items-center mb-4">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  Remember me
                </label>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
            
            {/* Toggle between Login and Register */}
            <div className="text-sm font-medium text-gray-500 text-center">
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-red-600 hover:underline"
                    onClick={() => setIsRegister(false)}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-red-600 hover:underline"
                    onClick={() => setIsRegister(true)}
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 