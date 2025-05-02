'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import { FadeInWhenVisible } from '@/components/ui/animations/FadeInWhenVisible';

// Create the ContactForm component with animations
const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-xl p-8 shadow-xl"
    >
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
          <p className="text-gray-300 mb-6">Thank you for contacting us. We'll get back to you as soon as possible.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSubmitted(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Send Another Message
          </motion.button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Your Name</label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative"
              >
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 focus:outline-none transition-all duration-300"
                  placeholder="John Doe"
                />
                <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 transform scale-x-0 origin-left transition-transform focus-within:scale-x-100"></div>
              </motion.div>
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Your Email</label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative"
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 focus:outline-none transition-all duration-300"
                  placeholder="your.email@example.com"
                />
                <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 transform scale-x-0 origin-left transition-transform focus-within:scale-x-100"></div>
              </motion.div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-300">Subject</label>
            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="relative"
            >
              <select
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                required
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 focus:outline-none transition-all duration-300"
              >
                <option value="" disabled>Select a topic</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Partnership">Partnership Opportunities</option>
                <option value="Pricing">Pricing Questions</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 transform scale-x-0 origin-left transition-transform focus-within:scale-x-100"></div>
            </motion.div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">Your Message</label>
            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="relative"
            >
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                rows={5}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 focus:outline-none transition-all duration-300"
                placeholder="How can we help you today?"
              ></textarea>
              <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 transform scale-x-0 origin-left transition-transform focus-within:scale-x-100"></div>
            </motion.div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-r-2 border-b-2 border-transparent mr-2"></div>
                <span>Sending...</span>
              </div>
            ) : 'Send Message'}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

// Contact Info component with animations
const ContactInfo = () => {
  const contactMethods = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      info: "support@fairsight.ai",
      description: "Our team is here to help you with any questions.",
      action: "Email us",
      link: "mailto:support@fairsight.ai"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: "Live Chat",
      info: "Available 24/7",
      description: "Get immediate support through our live chat.",
      action: "Start a chat",
      link: "#"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Knowledge Base",
      info: "Documentation & FAQs",
      description: "Find answers to common questions in our help center.",
      action: "Visit help center",
      link: "#"
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-xl p-8 shadow-xl h-full"
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>
      
      <div className="space-y-8">
        {contactMethods.map((method, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            className="flex items-start space-x-4"
          >
            <div className="bg-gray-800 p-3 rounded-lg">
              {method.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">{method.title}</h3>
              <p className="text-indigo-400 mb-1">{method.info}</p>
              <p className="text-gray-300 text-sm mb-2">{method.description}</p>
              <Link 
                href={method.link} 
                className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {method.action}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-3 text-white">Connect With Us</h3>
        <div className="flex space-x-4">
          {['twitter', 'facebook', 'linkedin', 'instagram'].map((social, index) => (
            <motion.a
              key={social}
              href={`https://${social}.com/fairsightai`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
              className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors"
            >
              <span className="sr-only">{social}</span>
              <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// AnimatedText component for the hero section
const AnimatedText = ({ text }: { text: string }) => {
  return (
    <div className="overflow-hidden">
      {Array.from(text).map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.1 + index * 0.04,
            ease: "easeOut"
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

// Office Locations component
const OfficeLocations = () => {
  const locations = [
    {
      city: "San Francisco",
      address: "123 AI District, San Francisco, CA 94107",
      phone: "+1 (415) 555-0123"
    },
    {
      city: "London",
      address: "456 Tech Lane, London EC1A 1BB, UK",
      phone: "+44 20 7123 4567"
    },
    {
      city: "Singapore",
      address: "789 Innovation Way, Singapore 018956",
      phone: "+65 6123 4567"
    }
  ];

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Global Offices</h2>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1}>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              FairSight AI has a global presence to serve clients around the world.
            </p>
          </FadeInWhenVisible>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <FadeInWhenVisible key={index} delay={0.1 * index} className="h-full">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 h-full hover:border-indigo-500/50 transition-all">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-3 text-indigo-400">{location.city}</h3>
                  <p className="text-gray-200 mb-2">{location.address}</p>
                  <p className="text-gray-300">{location.phone}</p>
                  <div className="mt-6">
                    <Link 
                      href="#" 
                      className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View on map
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Contact() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_center,theme(colors.white)_0%,theme(colors.slate.100)_30%,theme(colors.blue.900)_60%,theme(colors.gray.950)_100%)]">
      <Header />
      
      {/* Hero Section with animated text */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(30,58,138,0.3),transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">
                  <AnimatedText text="Get in Touch" />
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-4">
                <AnimatedText text="Have questions or need assistance? We're here to help you navigate the world of ethical AI." />
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Contact Form and Info Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
      
      {/* Office Locations Section */}
      <OfficeLocations />
    </main>
  );
} 