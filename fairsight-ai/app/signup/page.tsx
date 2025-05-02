'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/components/providers/AuthProvider';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Letter animation variants
const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
    },
  }),
};

// Text that animates letter by letter
const AnimatedText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

// Form field animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: 0.2 + i * 0.1,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0]
    } 
  }),
};

// Button animation variants
const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.03,
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -4px rgba(99, 102, 241, 0.4)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10
    }
  },
  tap: { scale: 0.97 }
};

// Simplified header for auth pages
const AuthHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        
        {/* Only show Sign In and Sign Up buttons */}
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/signin" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/signup" className="relative ml-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5">
            Sign Up
          </Link>
        </motion.div>
      </div>
    </header>
  );
};

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { register, loading, error: authError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validate password match
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    await register({
      email,
      password1: password,
      password2: confirmPassword,
      first_name: firstName,
      last_name: lastName
    });
  };

  const handleGoogleSignUp = () => {
    // Use the backend endpoint directly as it's already registered in Google Cloud Console
    window.location.href = 'http://localhost:8000/accounts/google/login/';
  };

  return (
    <>
      <AuthHeader />
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <motion.div 
            className="relative p-8 bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Background animated gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.div 
                className="absolute -inset-[100%] opacity-30"
                animate={{ 
                  background: [
                    "radial-gradient(circle at 60% 30%, rgba(99, 102, 241, 0.7) 0%, rgba(17, 24, 39, 0) 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(76, 29, 149, 0.7) 0%, rgba(17, 24, 39, 0) 50%)",
                    "radial-gradient(circle at 80% 70%, rgba(79, 70, 229, 0.7) 0%, rgba(17, 24, 39, 0) 50%)",
                    "radial-gradient(circle at 40% 40%, rgba(76, 29, 149, 0.7) 0%, rgba(17, 24, 39, 0) 50%)",
                  ]
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl font-bold text-white mb-2">
                    <span className="text-indigo-400">Join</span> FairSight AI
                  </h1>
                  <p className="mt-2 text-gray-400 font-light">
                    <AnimatedText text="Create your account in seconds" />
                  </p>
                </motion.div>
              </div>

              <AnimatePresence>
                {(localError || authError) && (
                  <motion.div 
                    className="p-3 mb-6 bg-red-500/20 border border-red-500/40 text-red-200 rounded-lg text-sm"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {localError || authError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <motion.div
                  custom={0}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1.5">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="block w-full px-4 py-3 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                          placeholder="John"
                        />
                        <div className="absolute inset-0 rounded-lg pointer-events-none border border-indigo-500/0 focus-within:border-indigo-500/50 transition-colors duration-200" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="block w-full px-4 py-3 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                          placeholder="Doe"
                        />
                        <div className="absolute inset-0 rounded-lg pointer-events-none border border-indigo-500/0 focus-within:border-indigo-500/50 transition-colors duration-200" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  custom={1}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                      placeholder="your@email.com"
                    />
                    <div className="absolute inset-0 rounded-lg pointer-events-none border border-indigo-500/0 focus-within:border-indigo-500/50 transition-colors duration-200" />
                  </div>
                </motion.div>

                <motion.div
                  custom={2}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-lg pointer-events-none border border-indigo-500/0 focus-within:border-indigo-500/50 transition-colors duration-200" />
                  </div>
                </motion.div>

                <motion.div
                  custom={3}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-4 py-3 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-lg pointer-events-none border border-indigo-500/0 focus-within:border-indigo-500/50 transition-colors duration-200" />
                  </div>
                </motion.div>
                
                <motion.div
                  custom={4}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  className="pt-2"
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating your account...
                      </span>
                    ) : 'Create Account'}
                  </motion.button>
                </motion.div>
              </form>

              <motion.div 
                className="mt-8"
                custom={5}
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <motion.button
                    onClick={handleGoogleSignUp}
                    className="w-full flex justify-center items-center py-3 px-4 rounded-lg border border-gray-700 bg-gray-800/70 hover:bg-gray-800 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FcGoogle className="h-5 w-5 mr-2" />
                    <span>Sign up with Google</span>
                  </motion.button>
                </div>
              </motion.div>

              <motion.div 
                className="text-center mt-8"
                custom={6}
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link href="/signin" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
} 