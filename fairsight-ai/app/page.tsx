'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, ReactNode, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/components/providers/AuthProvider';
import Header from '@/components/ui/Header';

// Dynamically import Spline to avoid SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video flex items-center justify-center bg-gray-900/50 rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-b-2 border-gray-700"></div>
    </div>
  ),
});

// Animate elements when they come into view
interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const FadeInWhenVisible = ({ children, delay = 0, className = '' }: FadeInWhenVisibleProps) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Hero section with animated elements and Spline 3D
const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-[radial-gradient(circle_at_center,theme(colors.white)_0%,theme(colors.slate.100)_30%,theme(colors.blue.900)_60%,theme(colors.gray.950)_100%)] min-h-screen flex flex-col justify-center items-center">
      {/* Background glow effects */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(30,58,138,0.3),transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center justify-center">
        {/* Left side animated text */}
        <div className="absolute left-0 md:left-8 top-1/2 -translate-y-1/2 transform -rotate-90 origin-center">
          <motion.div 
            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600 text-lg md:text-xl font-medium tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Array.from("ETHICAL AI SOLUTIONS").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.5 + index * 0.1,
                  ease: "easeOut"
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>
        
        {/* Right side animated text */}
        <div className="absolute right-0 md:right-8 top-1/2 -translate-y-1/2 transform rotate-90 origin-center">
          <motion.div 
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 text-lg md:text-xl font-medium tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Array.from("FAIRNESS • TRANSPARENCY").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 1.5 + index * 0.1,
                  ease: "easeOut"
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>
        
        {/* Spline 3D Element - Circular Container */}
        <motion.div 
          className="relative w-[700px] h-[700px] max-w-[95vw] max-h-[95vw] rounded-full overflow-hidden border border-gray-200/20 shadow-[0_0_100px_rgba(59,130,246,0.3)] bg-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
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
        </motion.div>
        
        {/* Bottom animated text (additional) */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-hidden">
              {Array.from("POWERED BY ADVANCED AI").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 2.5 + index * 0.1,
                    ease: "easeOut"
                  }}
                  className="inline-block text-sm text-gray-300 tracking-widest font-light"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Link href="/demo" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors shadow-lg hover:shadow-indigo-500/25">
            Try Free Demo
          </Link>
          <Link href="#how-it-works" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors border border-gray-700">
            How It Works
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Features section with animated cards
const Features = () => {
  const features = [
    {
      icon: "📊",
      title: "Fairness Metrics",
      description: "Comprehensive suite of algorithmic fairness metrics to evaluate your AI models across demographic groups."
    },
    {
      icon: "🔍",
      title: "Bias Detection",
      description: "Advanced algorithms to identify hidden biases in your training data and model outputs."
    },
    {
      icon: "📈",
      title: "Performance Analysis",
      description: "Ensure fairness doesn't come at the cost of accuracy with our detailed performance analysis."
    },
    {
      icon: "🛡️",
      title: "Ethical Evaluation",
      description: "Assess your AI against established ethical frameworks and industry best practices."
    },
    {
      icon: "📝",
      title: "Compliance Reports",
      description: "Generate detailed reports to demonstrate regulatory compliance and ethical considerations."
    },
    {
      icon: "🔄",
      title: "Continuous Monitoring",
      description: "Track fairness metrics over time to ensure consistent ethical performance."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-950">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Fairness Toolkit</h2>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              FairSight AI provides all the tools you need to ensure your AI systems are fair, ethical, and unbiased.
            </p>
          </FadeInWhenVisible>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeInWhenVisible key={index} delay={0.1 * index} className="h-full">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 h-full hover:border-indigo-500/50 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works section with numbered steps
const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Data",
      description: "Upload your dataset or connect to your existing data pipeline to begin the analysis process."
    },
    {
      number: "02",
      title: "Run Analysis",
      description: "Our algorithms will analyze your data and models for potential biases and ethical concerns."
    },
    {
      number: "03",
      title: "Review Results",
      description: "Examine detailed reports highlighting potential issues and areas for improvement."
    },
    {
      number: "04",
      title: "Implement Changes",
      description: "Follow our recommendations to mitigate bias and improve the fairness of your AI systems."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How FairSight AI Works</h2>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A simple four-step process to evaluate and improve the fairness of your AI models.
            </p>
          </FadeInWhenVisible>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <FadeInWhenVisible key={index} delay={0.1 * index}>
              <div className="mb-12 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                </div>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

// Use Cases section
const UseCases = () => {
  const cases = [
    {
      title: "Healthcare AI",
      description: "Ensure medical diagnostic models are fair across all demographic groups and avoid perpetuating health disparities."
    },
    {
      title: "Financial Services",
      description: "Evaluate lending and credit scoring models for potential discrimination against protected classes."
    },
    {
      title: "Hiring & HR",
      description: "Analyze recruiting tools and resume screening algorithms for bias against certain candidates."
    },
    {
      title: "Law Enforcement",
      description: "Assess risk prediction models for fairness across different communities and demographic groups."
    }
  ];

  return (
    <section id="use-cases" className="py-24 bg-gray-950">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              FairSight AI can be applied across various industries to ensure ethical AI implementation.
            </p>
          </FadeInWhenVisible>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {cases.map((item, index) => (
            <FadeInWhenVisible key={index} delay={0.1 * index}>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA section
const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 to-gray-900">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <FadeInWhenVisible>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Fairer AI?</h2>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.1}>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Join the growing list of organizations using FairSight AI to ensure their AI systems are ethical, fair, and unbiased.
          </p>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-white text-indigo-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-medium text-lg transition-colors shadow-lg">
              Start Free Trial
            </Link>
            <Link href="/demo" className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-medium text-lg transition-colors">
              Try Free Demo
            </Link>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">FairSight AI</h3>
            <p className="text-gray-400 mb-4">
              Building the future of ethical and fair artificial intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} FairSight AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Home page component
export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [googleUser, setGoogleUser] = useState<{name: string, email: string, picture?: string} | null>(null);
  
  // Handle OAuth tokens from URL if present
  useEffect(() => {
    // Check if user just logged out
    const justLoggedOut = localStorage.getItem('just_logged_out');
    if (justLoggedOut === 'true') {
      // Clear the flag and don't automatically log back in
      localStorage.removeItem('just_logged_out');
      setGoogleUser(null);
      return;
    }
    
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const accessToken = searchParams.get('access_token');
      const name = searchParams.get('name');
      const email = searchParams.get('email');
      const picture = searchParams.get('picture');
      const authenticated = searchParams.get('authenticated');
      
      if (accessToken && authenticated === 'true') {
        // Store the token in localStorage
        localStorage.setItem('access_token', accessToken);
        
        // Store user info
        if (email) {
          const userData = {
            name: name || email.split('@')[0],
            email,
            picture: picture || undefined
          };
          setGoogleUser(userData);
          
          // Clean up URL parameters
          const url = new URL(window.location.href);
          url.search = '';
          window.history.replaceState({}, document.title, url.toString());
        }
      }
    }
    
    // Cleanup function - runs when component unmounts
    return () => {
      // This helps prevent state persistence between navigation
      setGoogleUser(null);
    };
  }, []);
  
  const isUserAuthenticated = isAuthenticated || !!googleUser;
  const userName = user?.first_name || googleUser?.name || '';
  
  const handleLogout = () => {
    // Clear all local storage items related to authentication
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
    
    // Set a flag to prevent automatic re-login
    localStorage.setItem('just_logged_out', 'true');
    
    // Clear user state
    setGoogleUser(null);
    
    // Call auth context logout
    if (logout) {
      logout();
    }
    
    // Force reload the page to ensure all auth state is cleared
    window.location.href = '/signin';
  };

  return (
    <>
      <Header isAuthenticated={isUserAuthenticated} userName={userName} onLogout={handleLogout} />
      <main className="bg-gray-950 text-white">
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
