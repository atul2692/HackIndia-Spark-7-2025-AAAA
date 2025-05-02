'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UploadDataset from '@/components/ui/UploadDataset';

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
        <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>
        <Link href="/dashboard/datasets" className="flex items-center px-6 py-3 text-white bg-gray-800 border-l-4 border-indigo-500">
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
        <h1 className="text-xl font-semibold text-white">Datasets</h1>
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

export default function DatasetsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);
  
  useEffect(() => {
    // Fetch datasets
    const fetchDatasets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/datasets/sample_datasets/');
        if (response.ok) {
          const data = await response.json();
          setDatasets(data);
        }
      } catch (error) {
        console.error('Error fetching datasets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDatasets();
  }, []);
  
  return (
    <div className="bg-gray-950 min-h-screen">
      <DashboardNav />
      <Header />
      
      <main className="ml-64 pt-16 p-8">
        <div className="mb-8">
          <UploadDataset />
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-6 text-white">Existing Datasets</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-b-2 border-gray-700"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Format
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {datasets.map((dataset: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {dataset.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {dataset.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {dataset.format}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {dataset.file_size ? `${(dataset.file_size / 1024).toFixed(2)} KB` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-indigo-400 hover:text-indigo-300"
                          onClick={() => window.location.href = `/dashboard/analyses?datasetId=${dataset.id}`}
                        >
                          Run Analysis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 