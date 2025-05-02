'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'failed' | 'processing'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get payment status from query parameters
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (success === 'true') {
      setStatus('success');
      setMessage(message || 'Your payment was successful. Thank you for your subscription!');
    } else if (error) {
      setStatus('failed');
      setMessage(message || 'Your payment could not be processed. Please try again later.');
    } else {
      setStatus('processing');
      setMessage('Processing your payment...');
      
      // If there's no status, redirect to pricing page after a delay
      const timer = setTimeout(() => {
        router.push('/pricing');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-xl overflow-hidden p-8">
        <div className="text-center">
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
          )}
          
          {status === 'failed' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-20 h-20 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </motion.div>
          )}
          
          {status === 'processing' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 1,
                ease: "linear"
              }}
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
            >
              <svg className="w-16 h-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </motion.div>
          )}
          
          <h2 className="text-2xl font-bold mb-4">
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
            {status === 'processing' && 'Processing Payment'}
          </h2>
          
          <p className="text-gray-300 mb-8">{message}</p>
          
          <div className="flex gap-4 justify-center">
            {status === 'success' && (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
            
            {status === 'failed' && (
              <Link
                href="/pricing"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
              >
                Try Again
              </Link>
            )}
            
            <Link
              href="/"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 