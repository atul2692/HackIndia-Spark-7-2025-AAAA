'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import FadeInWhenVisible from '@/components/ui/animations/FadeInWhenVisible';

// Animated text for the hero section
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

// Mission & Vision component with animations
const MissionVision = () => {
  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeInWhenVisible>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-indigo-600/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-xl"></div>
              
              <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-xl p-8 relative">
                <span className="absolute -top-4 left-8 bg-indigo-600 text-white px-4 py-1 text-sm rounded-full">Our Mission</span>
                
                <h3 className="text-3xl font-bold mb-6 mt-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
                    Ensuring AI Fairness for All
                  </span>
                </h3>
                
                <p className="text-gray-300 mb-4">
                  At FairSight AI, our mission is to transform how organizations evaluate and ensure the fairness of their AI systems. We believe that ethical AI is not just a regulatory requirement but a fundamental necessity for building trust with users and society.
                </p>
                
                <p className="text-gray-300">
                  We're committed to providing accessible tools that empower AI developers and organizations to detect, measure, and mitigate bias in their AI systems, ensuring technology serves all people equitably.
                </p>
                
                <motion.div 
                  className="absolute -bottom-3 -right-3 w-16 h-16"
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-500/20">
                    <path d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0ZM50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10Z" fill="currentColor"/>
                  </svg>
                </motion.div>
              </div>
            </div>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay={0.2}>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-xl"></div>
              
              <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-xl p-8 relative">
                <span className="absolute -top-4 left-8 bg-blue-600 text-white px-4 py-1 text-sm rounded-full">Our Vision</span>
                
                <h3 className="text-3xl font-bold mb-6 mt-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    A Future of Ethical AI
                  </span>
                </h3>
                
                <p className="text-gray-300 mb-4">
                  We envision a world where AI systems are designed with fairness as a foundation, not an afterthought. Our vision is to lead the industry in creating standards and tools that make ethical AI assessment accessible to organizations of all sizes.
                </p>
                
                <p className="text-gray-300">
                  By democratizing access to fairness evaluation tools, we aim to contribute to a future where AI enhances human potential while respecting human dignity and diversity.
                </p>
                
                <motion.div 
                  className="absolute -bottom-3 -left-3 w-16 h-16"
                  animate={{ 
                    rotate: [0, -360],
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-500/20">
                    <path d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0ZM50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10Z" fill="currentColor"/>
                  </svg>
                </motion.div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
};

// Values section with animated icons
const OurValues = () => {
  const values = [
    {
      icon: "⚖️",
      title: "Fairness",
      description: "We believe AI systems should treat all individuals and groups equitably, without discriminating based on protected attributes."
    },
    {
      icon: "🔍",
      title: "Transparency",
      description: "We champion transparent AI systems where decision-making processes can be understood, examined, and explained."
    },
    {
      icon: "🤝",
      title: "Inclusivity",
      description: "We're committed to creating tools that serve the needs of diverse communities and perspectives."
    },
    {
      icon: "🛡️",
      title: "Integrity",
      description: "We maintain the highest standards of scientific rigor and business ethics in all our work."
    }
  ];

  return (
    <section className="py-24 bg-gray-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide our mission and shape our approach to ethical AI.
            </p>
          </FadeInWhenVisible>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <FadeInWhenVisible key={index} delay={0.1 * index} className="h-full">
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8 h-full border border-gray-700 hover:border-indigo-500/30 transition-colors shadow-lg"
              >
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-4xl mb-6"
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-indigo-400">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

// Call to Action component
const CallToAction = () => {
  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.15),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <FadeInWhenVisible>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make Your AI More Ethical?</h2>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.1}>
                <p className="text-xl text-gray-300 mb-6">
                  Join organizations worldwide that trust FairSight AI to evaluate and improve the fairness of their AI systems.
                </p>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/demo" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors shadow-lg hover:shadow-indigo-500/25 block text-center">
                      Try Free Demo
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/contact" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors border border-gray-700 block text-center">
                      Contact Us
                    </Link>
                  </motion.div>
                </div>
              </FadeInWhenVisible>
            </div>
            
            <div className="relative">
              <FadeInWhenVisible delay={0.3}>
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-indigo-600/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-xl"></div>
                  
                  <motion.div 
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-64 h-64 mx-auto"
                  >
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <g filter="url(#filter0_f_3_123)">
                        <path d="M50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90C27.9086 90 10 72.0914 10 50C10 27.9086 27.9086 10 50 10Z" stroke="url(#paint0_linear_3_123)" strokeWidth="2"/>
                      </g>
                      <circle cx="50" cy="50" r="30" stroke="url(#paint1_linear_3_123)" strokeWidth="2"/>
                      <path d="M50 20C67.6731 20 82 34.3269 82 52C82 69.6731 67.6731 84 50 84C32.3269 84 18 69.6731 18 52C18 34.3269 32.3269 20 50 20Z" stroke="url(#paint2_linear_3_123)" strokeOpacity="0.5" strokeWidth="2"/>
                      <defs>
                        <filter id="filter0_f_3_123" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                          <feGaussianBlur stdDeviation="4.5" result="effect1_foregroundBlur_3_123"/>
                        </filter>
                        <linearGradient id="paint0_linear_3_123" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4F46E5"/>
                          <stop offset="1" stopColor="#1E40AF"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_3_123" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4F46E5"/>
                          <stop offset="1" stopColor="#1E40AF"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_3_123" x1="18" y1="20" x2="82" y2="84" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4F46E5"/>
                          <stop offset="1" stopColor="#1E40AF"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function About() {
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
                  <AnimatedText text="About FairSight AI" />
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                <AnimatedText text="We're on a mission to make artificial intelligence more fair, transparent, and ethical for everyone." />
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision Section */}
      <MissionVision />
      
      {/* Our Values Section */}
      <OurValues />
      
      {/* Call to Action Section - Spacing adjusted for better flow */}
      <div className="mt-8">
        <CallToAction />
      </div>
    </main>
  );
} 