'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

const Header = ({ isAuthenticated: propIsAuthenticated, userName: propUserName, onLogout: propOnLogout }: HeaderProps = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated: authIsAuthenticated, user, logout: authLogout } = useAuth();
  
  // Use either props or values from context
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : authIsAuthenticated;
  const displayName = propUserName || user?.first_name || user?.email?.split('@')[0] || 'User';
  const handleLogout = propOnLogout || authLogout;
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const performLogout = () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
    
    // Set a flag to prevent automatic re-login
    localStorage.setItem('just_logged_out', 'true');
    
    // Call the provided logout function or the one from auth context
    if (handleLogout) {
      handleLogout();
    }
    
    // Close menus
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    
    // Force reload to clear all state
    window.location.href = '/signin';
  };

  return (
    <header className={`py-4 px-4 md:px-8 lg:px-12 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-500">Fair</span>
            <span className="text-white">Sight</span>
            <span className="bg-indigo-600 px-2 py-1 text-sm rounded-md ml-1">AI</span>
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/about" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">About</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/#features" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Features</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/feedback" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Feedback</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/pricing" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Pricing</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/demo" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Demo</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/contact" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Contact</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 px-4 py-2 rounded-lg text-white transition-all duration-300"
              >
                <span>{displayName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                    Profile
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      performLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/signup" className="relative ml-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5">
                Sign Up
              </Link>
            </>
          )}
        </motion.nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden mt-4 bg-gray-900 rounded-lg py-4 px-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4 px-4">
            <Link href="/about" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">About</Link>
            <Link href="/#features" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Features</Link>
            <Link href="/feedback" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Feedback</Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Pricing</Link>
            <Link href="/demo" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Demo</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Contact</Link>
            
            {isAuthenticated ? (
              <>
                <div className="text-indigo-400 font-semibold py-2 px-4 bg-indigo-600/10 rounded-md">
                  Signed in as {displayName}
                </div>
                <Link href="/profile" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Profile</Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    performLogout();
                  }}
                  className="text-left text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Sign In</Link>
                <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white transition-colors text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header; 