'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use our API endpoint instead of directly calling LM Studio
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1',
          messages: [
            // System prompt to instruct model to keep responses short
            { role: 'system', content: 'You are a helpful, concise assistant. Keep your responses brief and to the point - ideally 1-3 sentences maximum. Format important information in bold using markdown **like this**.' },
            ...messages, 
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 150, // Limit response length
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]?.message) {
        setMessages(prev => [...prev, {
          role: 'assistant' as const,
          content: data.choices[0].message.content
        }]);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error connecting to LM Studio:', error);
      setMessages(prev => [...prev, {
        role: 'assistant' as const,
        content: 'Connection error. Please check if LM Studio server is running.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format message content (convert markdown to HTML)
  const formatMessage = (content: string) => {
    // Convert bold markdown to styled spans
    const formattedText = content
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
      .replace(/\n/g, '<br/>');
    
    return { __html: formattedText };
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-indigo-500/25"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Chat header */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                <h3 className="font-medium">AI Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg max-w-[85%] ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div dangerouslySetInnerHTML={formatMessage(message.content)} />
                  </div>
                  <div 
                    className={`text-xs mt-1 text-gray-500 ${message.role === 'user' ? 'text-right mr-2' : 'text-left ml-2'}`}
                  >
                    {message.role === 'user' ? 'You' : 'AI'}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-left mb-4">
                  <div className="inline-block p-3 rounded-lg max-w-[80%] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || inputValue.trim() === ''}
                  className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-r-lg ${
                    isLoading || inputValue.trim() === '' 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 