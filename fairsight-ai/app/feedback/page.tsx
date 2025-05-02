'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/ui/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { Star, StarBorder } from '@mui/icons-material';

// Types
interface Feedback {
  id: number;
  name: string | null;
  email: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Set name and email if authenticated
    if (isAuthenticated && user) {
      setName(user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.email);
      setEmail(user.email || '');
    }
    
    // Load existing feedback
    fetchFeedbacks();
  }, [isAuthenticated, user]);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/feedback/`);
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simple POST request without authentication
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          rating,
          comment,
        }),
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form
        setName('');
        setEmail('');
        setRating(0);
        setComment('');
        
        // Reload feedback
        fetchFeedbacks();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Failed to submit feedback');
      }
    } catch (error) {
      setSubmitError('An error occurred while submitting your feedback');
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-16">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Feedback Matters
        </motion.h1>
        
        <motion.p 
          className="text-center mb-12 text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We value your input to improve FairSight AI. Share your thoughts and experiences with our platform.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Feedback Form */}
          <motion.div 
            className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-indigo-400">Submit Your Feedback</h2>
            
            {submitSuccess && (
              <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded mb-6">
                Thank you for your feedback! We appreciate your input.
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded mb-6">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl text-yellow-500 focus:outline-none"
                    >
                      {star <= (hoverRating || rating) ? (
                        <Star fontSize="inherit" />
                      ) : (
                        <StarBorder fontSize="inherit" />
                      )}
                    </button>
                  ))}
                  <span className="ml-2 text-gray-400">
                    {rating > 0 ? `${rating} of 5` : 'Select a rating'}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Feedback
                </label>
                <textarea
                  id="comment"
                  rows={5}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Share your thoughts, suggestions, or experiences..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </motion.div>
          
          {/* Right Column - Previous Feedback */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-indigo-400">Recent Feedback</h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <div 
                    key={feedback.id} 
                    className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{feedback.name || 'Anonymous'}</h3>
                        <div className="flex text-yellow-500 mt-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < feedback.rating ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{formatDate(feedback.created_at)}</span>
                    </div>
                    <p className="text-gray-300 mt-2 whitespace-pre-line">{feedback.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No feedback yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 