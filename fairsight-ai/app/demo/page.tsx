'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { motion, MotionValue } from 'framer-motion';
import UploadDataset from '@/components/ui/UploadDataset';

// Text animation component
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

const AnimatedText = ({ text, className, delay = 0, speed = 0.05 }: AnimatedTextProps) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: speed, delayChildren: delay * i }
    }),
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };
  
  return (
    <motion.div
      className={`w-full text-center ${className || ''}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Demo page navigation component
const Header = () => {
  return (
    <header className="h-16 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8">
      <div>
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-indigo-500">Fair</span>
          <span className="text-white">Sight</span>
          <span className="bg-indigo-600 px-2 py-1 text-sm rounded-md ml-1">AI</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-gray-300 hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white transition-colors shadow-lg shadow-indigo-600/20">
          Dashboard
        </Link>
      </div>
    </header>
  );
};

export default function DemoPage() {
  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen">
      <Header />
      
      <main className="pt-24 p-8 md:p-12 lg:p-16 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12 w-full flex flex-col items-center justify-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white w-full">
              <AnimatedText 
                text="Try FairSight AI" 
                className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text"
                delay={0.2}
              />
            </h1>
            <div className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed w-full">
              <AnimatedText 
                text="Experience our AI fairness analysis in action. Upload a dataset and analyze for bias across multiple protected attributes."
                delay={1.5}
                speed={0.01}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-gray-900/70 border border-gray-800 p-8 rounded-2xl mb-8 shadow-xl shadow-indigo-900/10">
              <h2 className="text-2xl font-semibold mb-6 text-white text-center">
                <AnimatedText text="How It Works" delay={2.5} className="inline-block" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800/80 p-6 rounded-xl transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4 shadow-lg shadow-indigo-600/30">1</div>
                  <h3 className="text-lg font-medium mb-3 text-white">Upload Your Dataset</h3>
                  <p className="text-gray-300">Upload a CSV file with protected attributes (gender, age, income) and outcome variables.</p>
                </div>
                
                <div className="bg-gray-800/80 p-6 rounded-xl transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4 shadow-lg shadow-indigo-600/30">2</div>
                  <h3 className="text-lg font-medium mb-3 text-white">Choose Analysis</h3>
                  <p className="text-gray-300">Select which protected attribute to analyze for potential bias and unfairness.</p>
                </div>
                
                <div className="bg-gray-800/80 p-6 rounded-xl transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4 shadow-lg shadow-indigo-600/30">3</div>
                  <h3 className="text-lg font-medium mb-3 text-white">Review Results</h3>
                  <p className="text-gray-300">Get detailed metrics, insights, and reweighted datasets to mitigate identified bias.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-xl"
          >
            <UploadDataset />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-300 mb-5">Want to explore more features?</p>
            <Link 
              href="/dashboard/datasets" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 inline-block shadow-lg shadow-indigo-600/30 hover:-translate-y-1"
            >
              Go to Full Dashboard
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-20 border-t border-gray-800 pt-10"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white text-center">
              <AnimatedText text="Sample Dataset Format" delay={3} className="inline-block" />
            </h2>
            <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-xl overflow-x-auto shadow-lg">
              <pre className="text-gray-300 font-mono text-sm">
{`age,gender,education,income,approved
32,Male,12,50000,1
45,Male,16,75000,1
37,Female,16,70000,0
26,Female,12,45000,0
42,Male,14,65000,1
...`}
              </pre>
            </div>
            <p className="text-gray-400 mt-5 text-sm">
              Your dataset should include protected attribute columns (gender, age, income) and an outcome column 
              (approved, where 1=approved, 0=denied). For age, values ≥30 are considered privileged. 
              For income, values ≥50,000 are considered privileged.
            </p>
            <div className="mt-6 flex justify-center">
              <a 
                href="/sample_dataset.csv" 
                download 
                className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors bg-gray-800/50 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Sample Dataset
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 border-t border-gray-800 pt-10"
          >
            <h2 className="text-2xl font-semibold mb-8 text-white text-center">
              <AnimatedText text="Multi-Attribute Fairness Analysis" delay={3.5} className="inline-block" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900/70 border border-gray-800 p-6 rounded-xl flex flex-col items-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-900/20">
                <div className="text-5xl mb-5 bg-indigo-900/30 p-4 rounded-full">👥</div>
                <h3 className="text-lg font-medium mb-3 text-center text-white">Gender Fairness</h3>
                <p className="text-gray-400 text-center">Detect bias in how different gender groups are treated in outcomes.</p>
              </div>
              
              <div className="bg-gray-900/70 border border-gray-800 p-6 rounded-xl flex flex-col items-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-900/20">
                <div className="text-5xl mb-5 bg-indigo-900/30 p-4 rounded-full">⏳</div>
                <h3 className="text-lg font-medium mb-3 text-center text-white">Age Fairness</h3>
                <p className="text-gray-400 text-center">Identify discrimination based on age groups in your dataset.</p>
              </div>
              
              <div className="bg-gray-900/70 border border-gray-800 p-6 rounded-xl flex flex-col items-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-900/20">
                <div className="text-5xl mb-5 bg-indigo-900/30 p-4 rounded-full">💰</div>
                <h3 className="text-lg font-medium mb-3 text-center text-white">Income Fairness</h3>
                <p className="text-gray-400 text-center">Measure bias related to income levels in decision outcomes.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-900/30 p-8 rounded-xl shadow-lg">
              <div className="flex items-start">
                <div className="bg-indigo-600/20 p-3 rounded-lg mr-5 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-3">Why Multi-Attribute Analysis?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Fairness is multidimensional. By analyzing multiple protected attributes, you can gain a more 
                    comprehensive understanding of how your models might impact different groups and identify 
                    potential intersectional bias that might be missed with single-attribute analysis.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 