'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { createOrder, verifyPayment, loadRazorpayScript } from '../services/razorpay';
import { useRouter } from 'next/navigation';

// Component for fade-in animations
interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const FadeInWhenVisible = ({ children, delay = 0, className = '' }: FadeInWhenVisibleProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Header component - reused from main page
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        
        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/#features" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Features</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/#how-it-works" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">How It Works</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/#use-cases" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Use Cases</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/pricing" className="relative px-4 py-2 text-white font-medium group transition-colors">
            <span className="relative z-10">Pricing</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/20 transform origin-left scale-100 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 transition-all duration-300"></span>
          </Link>
          <Link href="/dashboard" className="relative px-4 py-2 text-gray-300 hover:text-white group transition-colors">
            <span className="relative z-10">Dashboard</span>
            <span className="absolute inset-0 rounded-md bg-blue-600/0 group-hover:bg-blue-600/20 transform origin-left group-hover:scale-100 scale-0 transition-all duration-300 ease-out"></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/contact" className="relative ml-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5">
            Get Started
          </Link>
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
            <Link href="/#features" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Features</Link>
            <Link href="/#how-it-works" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">How It Works</Link>
            <Link href="/#use-cases" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Use Cases</Link>
            <Link href="/pricing" className="text-white py-2 px-4 bg-indigo-600/20 rounded-md transition-colors">Pricing</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white py-2 px-4 hover:bg-indigo-600/20 rounded-md transition-colors">Dashboard</Link>
            <Link href="/contact" className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white transition-colors text-center">
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

// Individual plan card component
interface PlanCardProps {
  title: string;
  price: string | number;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
  delay?: number;
}

const PlanCard = ({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false, 
  ctaText = "Get Started", 
  delay = 0
}: PlanCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay checkout. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Create order
      console.log('Creating order for amount:', Number(price));
      const orderData = await createOrder(Number(price));
      console.log('Order created:', orderData);
      
      // Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.razorpay_order.amount,
        currency: orderData.razorpay_order.currency,
        name: 'FairSight AI',
        description: `${title} Plan Subscription`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            console.log('Payment successful, verifying:', response);
            // Verify payment
            const verifyData = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verifyData.success) {
              router.push(`/pricing/payment-status?success=true&message=${encodeURIComponent('Your payment was successful. Thank you for your subscription!')}`);
            } else {
              router.push(`/pricing/payment-status?error=true&message=${encodeURIComponent(verifyData.message || 'Payment verification failed.')}`);
            }
          } catch (error: any) {
            console.error('Error verifying payment:', error);
            router.push(`/pricing/payment-status?error=true&message=${encodeURIComponent(error?.message || 'Payment verification failed. Please contact support.')}`);
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setIsLoading(false);
          }
        }
      };
      
      // @ts-ignore
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setIsLoading(false);
      
      // Show a more user-friendly error message
      if (error.message.includes('<!DOCTYPE html>')) {
        // This is likely a server error returning HTML instead of JSON
        alert('The payment service is currently unavailable. Please try again later.');
      } else {
        alert(error?.message || 'An error occurred during payment processing. Please try again later.');
      }
    }
  };

  return (
    <FadeInWhenVisible delay={delay} className="flex-1 min-w-[300px]">
      <motion.div 
        className={`h-full relative rounded-2xl overflow-hidden border ${
          isPopular ? 'border-indigo-500 bg-gradient-to-b from-indigo-950 to-gray-900' : 'border-gray-800 bg-gray-900'
        } p-6 flex flex-col`}
        whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.1), 0 10px 10px -5px rgba(79, 70, 229, 0.04)" }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {isPopular && (
          <div className="absolute -right-12 top-5 rotate-45 bg-indigo-600 py-1 px-12 text-sm font-medium text-white">
            Most Popular
          </div>
        )}
        <div className="mb-5">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        
        <div className="mb-5">
          <span className="text-3xl font-bold text-white">₹{price}</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <button 
              onClick={handlePayment}
              disabled={isLoading}
              className={`block w-full text-center py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                isPopular 
                  ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25' 
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : ctaText}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </FadeInWhenVisible>
  );
};

// Floating background elements
const BackgroundElements = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute top-1/4 -left-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
    <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
    <motion.div 
      className="absolute top-1/3 left-1/4 w-4 h-4 bg-indigo-400 rounded-full"
      animate={{ 
        y: [0, -20, 0],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 5,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-blue-400 rounded-full"
      animate={{ 
        y: [0, -15, 0],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 4,
        ease: "easeInOut",
        delay: 1
      }}
    />
    <motion.div 
      className="absolute top-2/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full"
      animate={{ 
        y: [0, -10, 0],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut",
        delay: 2
      }}
    />
  </div>
);

// Main pricing section
const PricingSection = () => {
  const [activeTab, setActiveTab] = useState('individual');
  
  const individualPlans = [
    {
      title: "Free",
      price: "0",
      description: "Perfect for getting started with ethical AI evaluation",
      features: [
        "10 model evaluations per month",
        "Basic fairness metrics",
        "Standard reporting",
        "Community support",
        "Documentation access"
      ],
      isPopular: false,
      ctaText: "Start Free"
    },
    {
      title: "Pro",
      price: "49",
      description: "For professionals looking for advanced fairness insights",
      features: [
        "50 model evaluations per month",
        "Advanced fairness metrics",
        "Custom reporting",
        "Email support",
        "API access (limited)",
        "Export capabilities",
        "Bias mitigation recommendations"
      ],
      isPopular: true
    },
    {
      title: "Expert",
      price: "99",
      description: "For serious AI developers requiring comprehensive analysis",
      features: [
        "Unlimited model evaluations",
        "Full metrics suite",
        "Custom dashboards",
        "Priority support",
        "Full API access",
        "Advanced export options",
        "Bias mitigation toolkit",
        "Custom dataset support"
      ],
      isPopular: false
    }
  ];
  
  const organizationPlans = [
    {
      title: "Team",
      price: "199",
      description: "For small teams building ethical AI solutions",
      features: [
        "Up to 5 team members",
        "200 model evaluations per month",
        "All Pro features",
        "Team collaboration tools",
        "Shared workspaces",
        "Team reporting",
        "Dedicated support"
      ],
      isPopular: false
    },
    {
      title: "Business",
      price: "499",
      description: "For growing organizations with multiple AI projects",
      features: [
        "Up to 15 team members",
        "500 model evaluations per month",
        "All Expert features",
        "Advanced collaboration",
        "Role-based permissions",
        "Audit logs",
        "Priority support",
        "Compliance reporting"
      ],
      isPopular: true
    },
    {
      title: "Enterprise",
      price: "9999",
      description: "For large organizations with complex AI governance needs",
      features: [
        "Unlimited team members",
        "Unlimited evaluations",
        "All Business features",
        "Custom integration options",
        "Dedicated account manager",
        "SLA guarantees",
        "On-premises option",
        "Custom compliance reporting",
        "Training and workshops"
      ],
      isPopular: false,
      ctaText: "Get Started"
    }
  ];
  
  const activeTabVariants = {
    active: { backgroundColor: 'rgba(79, 70, 229, 0.2)', color: '#ffffff' },
    inactive: { backgroundColor: 'rgba(31, 41, 55, 0.5)', color: '#9ca3af' }
  };
  
  return (
    <section className="pt-32 pb-24 relative min-h-screen flex flex-col justify-center items-center bg-gray-950">
      <BackgroundElements />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Array.from("Transparent Pricing for Ethical AI").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.1 + index * 0.05,
                  ease: "easeOut"
                }}
                className="inline-block"
                style={{ 
                  marginRight: char === " " ? "0.25em" : "0",
                  width: char === " " ? "0.25em" : "auto" 
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            Choose the plan that's right for your ethical AI journey, whether you're an individual developer or a large organization.
          </motion.p>
          
          <motion.div 
            className="inline-flex bg-gray-800 p-1 rounded-lg shadow-inner mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              className={`py-2 px-6 rounded-md text-sm font-medium transition-all duration-200`}
              variants={activeTabVariants}
              animate={activeTab === 'individual' ? 'active' : 'inactive'}
              onClick={() => setActiveTab('individual')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Individual
            </motion.button>
            <motion.button
              className={`py-2 px-6 rounded-md text-sm font-medium transition-all duration-200`}
              variants={activeTabVariants}
              animate={activeTab === 'organization' ? 'active' : 'inactive'}
              onClick={() => setActiveTab('organization')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Organization
            </motion.button>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex flex-wrap gap-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {activeTab === 'individual' ? (
            individualPlans.map((plan, index) => (
              <PlanCard key={plan.title} {...plan} delay={index * 0.1} />
            ))
          ) : (
            organizationPlans.map((plan, index) => (
              <PlanCard key={plan.title} {...plan} delay={index * 0.1} />
            ))
          )}
        </motion.div>
        
        <FadeInWhenVisible delay={0.5}>
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Need a custom solution?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We understand that organizations have unique needs. Contact our sales team for a tailored solution that fits your specific requirements.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                <span>Contact Sales</span>
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </motion.div>
          </div>
        </FadeInWhenVisible>
        
        <FadeInWhenVisible delay={0.7} className="mt-20">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Can I switch between plans?</h3>
                <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-400">We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Do you offer educational discounts?</h3>
                <p className="text-gray-400">Yes, we offer special pricing for educational institutions and students. Contact our support team for more information.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">What is a model evaluation?</h3>
                <p className="text-gray-400">A model evaluation is a complete fairness assessment of one AI model against one dataset. It includes all available metrics and a comprehensive report.</p>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-500">Fair</span>
              <span className="text-white">Sight</span>
              <span className="bg-indigo-600 px-2 py-1 text-sm rounded-md ml-1">AI</span>
            </Link>
            <p className="text-gray-400 mt-2">Ethical AI evaluation for everyone</p>
          </div>
          
          <div className="flex gap-8 flex-wrap justify-center">
            <div>
              <h3 className="text-white font-medium mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">© 2023 FairSight AI. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <Header />
      <PricingSection />
      <Footer />
    </main>
  );
} 