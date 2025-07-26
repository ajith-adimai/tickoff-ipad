import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface AuthProps {
  onBackToLanding?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBackToLanding }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Email validation function
  const validateEmail = (email: string): { isValid: boolean; error: string } => {
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Check for common disposable email domains
    const disposableDomains = [
      'tempmail.org', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com',
      'mailinator.com', 'yopmail.com', 'throwaway.email', 'temp-mail.io',
      'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
      'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com',
      'mailnesia.com', 'mintemail.com', 'spamspot.com', 'spam.la',
      'trashmail.net', 'getairmail.com', 'maildrop.cc', 'mailmetrash.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      return { isValid: false, error: 'Disposable email addresses are not allowed' };
    }

    // Check for minimum length
    if (email.length < 5) {
      return { isValid: false, error: 'Email address is too short' };
    }

    // Check for maximum length
    if (email.length > 254) {
      return { isValid: false, error: 'Email address is too long' };
    }

    // Check for valid characters
    const validCharRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!validCharRegex.test(email)) {
      return { isValid: false, error: 'Email contains invalid characters' };
    }

    // Check for consecutive dots
    if (email.includes('..')) {
      return { isValid: false, error: 'Email cannot contain consecutive dots' };
    }

    // Check for valid domain format
    const domainParts = domain?.split('.');
    if (!domainParts || domainParts.length < 2 || domainParts.some(part => part.length === 0)) {
      return { isValid: false, error: 'Invalid domain format' };
    }

    // Check TLD length
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2 || tld.length > 6) {
      return { isValid: false, error: 'Invalid top-level domain' };
    }

    return { isValid: true, error: '' };
  };

  // Handle email input change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail.trim() === '') {
      setEmailError('');
      setIsEmailValid(false);
      return;
    }

    const validation = validateEmail(newEmail);
    setEmailError(validation.error);
    setIsEmailValid(validation.isValid);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Client-side email validation
    if (!isEmailValid) {
      setMessage('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">TickOff</h1>
            <p className="text-gray-600">Track your habits, achieve your goals</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  emailError ? 'text-red-400' : isEmailValid ? 'text-green-400' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    emailError 
                      ? 'border-red-300 focus:ring-red-500' 
                      : isEmailValid 
                      ? 'border-green-300 focus:ring-green-500' 
                      : 'border-gray-300 focus:ring-primary-500'
                  }`}
                  placeholder="Enter your email"
                  required
                />
                {isEmailValid && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                )}
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-sm ${
                  message.includes('Check your email') 
                    ? 'bg-success-100 text-success-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !isEmailValid || email.trim() === ''}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
            {onBackToLanding && (
              <div>
                <button
                  onClick={onBackToLanding}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth; 