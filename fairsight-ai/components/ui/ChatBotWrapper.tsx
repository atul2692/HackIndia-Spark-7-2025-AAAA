'use client';

import dynamic from 'next/dynamic';

// Dynamically import ChatBot with no SSR
const ChatBot = dynamic(() => import('./ChatBot'), {
  ssr: false,
});

export default function ChatBotWrapper() {
  return <ChatBot />;
} 