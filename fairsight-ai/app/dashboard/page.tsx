'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Spline to avoid SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-b-2 border-gray-700"></div>
    </div>
  ),
});

// Dashboard Navigation Component
const DashboardNav = () => {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-indigo-500">Fair</span>
          <span className="text-white">Sight</span>
          <span className="bg-indigo-600 px-2 py-1 text-sm rounded-md ml-1">AI</span>
        </Link>
      </div>
      <nav className="mt-4">
        <div className="px-4 py-2 text-xs text-gray-500 uppercase">Main</div>
        <Link href="/dashboard" className="flex items-center px-6 py-3 text-white bg-gray-800 border-l-4 border-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>
        <Link href="/dashboard/datasets" className="flex items-center px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Datasets
        </Link>
        <Link href="/dashboard/models" className="flex items-center px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Models
        </Link>
        <Link href="/dashboard/analyses" className="flex items-center px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analyses
        </Link>
        
        <div className="px-4 py-2 mt-6 text-xs text-gray-500 uppercase">Management</div>
        <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
        <Link href="/dashboard/help" className="flex items-center px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Help
        </Link>
      </nav>
    </aside>
  );
};

// Header component
const Header = () => {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      </div>
      <div className="flex items-center">
        <button className="p-2 mr-4 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="relative">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              A
            </div>
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, changeType }: { title: string; value: string; change: string; changeType: 'up' | 'down' | 'neutral' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 border border-gray-800 p-6 rounded-xl"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1 text-white">{value}</p>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
          changeType === 'up' ? 'bg-green-500/10 text-green-400' : 
          changeType === 'down' ? 'bg-red-500/10 text-red-400' : 
          'bg-gray-500/10 text-gray-400'
        }`}>
          {changeType === 'up' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : changeType === 'down' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          )}
          {change}
        </div>
      </div>
    </motion.div>
  );
};

// Fairness Score Component
const FairnessScore = ({ score }: { score: number }) => {
  // Calculate the color based on the score
  const getColor = () => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-green-400';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  // Calculate the circumference and offset
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center justify-center"
    >
      <h3 className="text-lg font-semibold mb-4 text-white">Fairness Score</h3>
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="transparent" 
            stroke="#1f2937" 
            strokeWidth="8"
          />
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={getColor()}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-bold ${getColor()}`}>{score}</span>
          <span className="text-xs text-gray-400">out of 100</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-gray-300">Your AI system's fairness rating</p>
      </div>
    </motion.div>
  );
};

// Recent Analyses Component
const RecentAnalyses = () => {
  // Mock data for recent analyses
  const analyses = [
    { id: 1, name: 'Credit Application Model', status: 'completed', fairness: 87, ethical: 92, date: '2 hours ago' },
    { id: 2, name: 'Healthcare Diagnosis', status: 'completed', fairness: 76, ethical: 81, date: '1 day ago' },
    { id: 3, name: 'Resume Screening Algorithm', status: 'failed', fairness: 62, ethical: 58, date: '3 days ago' },
    { id: 4, name: 'Crime Prediction', status: 'completed', fairness: 71, ethical: 68, date: '1 week ago' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">Recent Analyses</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fairness Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ethical Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {analyses.map((analysis) => (
              <tr key={analysis.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{analysis.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    analysis.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    analysis.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {analysis.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{analysis.fairness}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{analysis.ethical}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{analysis.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/dashboard/analyses/${analysis.id}`} className="text-indigo-400 hover:text-indigo-300">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// Bias Detection Component
const BiasDetection = () => {
  const biasItems = [
    { category: 'Gender', level: 'Low', score: 82 },
    { category: 'Age', level: 'Medium', score: 67 },
    { category: 'Race', level: 'Low', score: 88 },
    { category: 'Education', level: 'Medium', score: 72 },
    { category: 'Nationality', level: 'Low', score: 91 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gray-900 border border-gray-800 p-6 rounded-xl"
    >
      <h3 className="text-lg font-semibold mb-4 text-white">Bias Detection Results</h3>
      <div className="space-y-4">
        {biasItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{item.category}</span>
              <span className={`text-sm ${
                item.level === 'Low' ? 'text-green-400' : 
                item.level === 'Medium' ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                {item.level} Bias
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  item.score >= 80 ? 'bg-green-500' : 
                  item.score >= 60 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Insights Component
const Insights = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gray-900 border border-gray-800 p-6 rounded-xl"
    >
      <h3 className="text-lg font-semibold mb-4 text-white">Key Insights</h3>
      <ul className="space-y-3">
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-300">Your models show good fairness across gender groups</span>
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-gray-300">Age-related bias detected in credit scoring model</span>
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-300">Your feature engineering process reduces bias effectively</span>
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-300">Consider evaluating your models on more diverse datasets</span>
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-300">Resume screening algorithm shows educational bias</span>
        </li>
      </ul>
    </motion.div>
  );
};

// 3D Model Visualization Component
const ModelVisualization = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">AI Model Visualization</h3>
      </div>
      <div className="h-[300px] relative">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-b-2 border-gray-700"></div>
          </div>
        }>
          <Spline 
            scene="https://prod.spline.design/mKuEEOsAGJ8pFrTs/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Handle OAuth tokens from URL if present
  useEffect(() => {
    const handleOAuthTokens = () => {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = searchParams.get('access_token');
        const idToken = searchParams.get('id_token');
        
        if (accessToken) {
          // Store the token in localStorage
          localStorage.setItem('access_token', accessToken);
          
          // Clean up URL parameters
          const url = new URL(window.location.href);
          url.searchParams.delete('access_token');
          url.searchParams.delete('id_token');
          window.history.replaceState({}, document.title, url.toString());
          
          // Fetch user profile if needed
          fetchUserProfile(accessToken);
        }
      }
    };
    
    const fetchUserProfile = async (token: string) => {
      try {
        // Call backend API to get user profile
        const response = await fetch('http://localhost:8000/api/auth/user/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    handleOAuthTokens();
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <DashboardNav />
      
      <main className="ml-64 pt-16">
        <Header />
        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-b-2 border-gray-700"></div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Analyses" value="24" change="12%" changeType="up" />
                <StatCard title="Active Models" value="8" change="3" changeType="up" />
                <StatCard title="Datasets" value="15" change="0%" changeType="neutral" />
                <StatCard title="Bias Alerts" value="2" change="50%" changeType="down" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <FairnessScore score={83} />
                <BiasDetection />
                <Insights />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <RecentAnalyses />
                </div>
                <ModelVisualization />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 