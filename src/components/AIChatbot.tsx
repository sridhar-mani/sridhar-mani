import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, FileSearch, Sparkles } from 'lucide-react';
import { initAI, getReply } from '@/utils/aiWorker';
import { JobAnalyzer } from './JobAnalyzer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  "What is NPC Code?",
  "Tell me about your WebGPU Worker",
  "What's your experience with CFD?",
  "What are your core technical skills?",
];

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'analyzer'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Sridhar's AI assistant powered by local in-browser LLM. Ask me anything about my autonomous coding agents, WebGPU pipelines, CFD visualization, or projects!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = async () => {
    setIsOpen(true);

    if (!isInitialized && !isInitializing) {
      setIsInitializing(true);
      setInitError(null);

      try {
        await initAI();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize AI:', error);
        setInitError('Failed to load local AI model. Please verify your browser has WebGPU enabled (Chrome / Edge / Firefox Nightly).');
      } finally {
        setIsInitializing(false);
      }
    }
  };

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading || !isInitialized) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: queryText }]);
    setIsLoading(true);

    try {
      const response = await getReply(queryText);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input.trim());
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full shadow-lg hidden md:flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Chat"
      >
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header with Tabs */}
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Sridhar's Local AI</h3>
                    <p className="text-white/80 text-xs">
                      {isInitializing ? 'Loading Qwen2.5 weights...' : isInitialized ? 'Online (Local WebGPU)' : 'Standby'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close Chatbot"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Tab Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white/25 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <MessageCircle size={14} className="inline mr-2" />
                  AI Chat
                </button>
                <button
                  onClick={() => setActiveTab('analyzer')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'analyzer'
                      ? 'bg-white/25 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <FileSearch size={14} className="inline mr-2" />
                  Job Fit Analyzer
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'chat' ? (
              <>
                {/* Messages Container */}
                <div className="h-[320px] overflow-y-auto p-4 space-y-3.5 bg-gray-50">
                  {isInitializing && (
                    <div className="flex items-center gap-3 p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                      <Loader2 size={18} className="text-blue-500 animate-spin shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Initializing Local WebLLM Engine</p>
                        <p className="text-xs text-blue-600">Loading Qwen model & vector embeddings into browser cache...</p>
                      </div>
                    </div>
                  )}

                  {initError && (
                    <div className="p-3.5 bg-red-50 rounded-xl border border-red-200">
                      <p className="text-xs text-red-700 leading-relaxed">{initError}</p>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-cyan-500 to-cyan-600'
                            : 'bg-gradient-to-br from-purple-500 to-purple-600'
                        }`}
                      >
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-[82%] ${
                          msg.role === 'user'
                            ? 'bg-cyan-500 text-white rounded-br-md text-sm'
                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md text-xs sm:text-sm leading-relaxed'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        <Bot size={14} />
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                        <div className="flex gap-1.5 items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Prompt Chips */}
                {isInitialized && !isLoading && (
                  <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendQuery(prompt)}
                        className="shrink-0 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-cyan-50 hover:text-cyan-700 border border-gray-200 text-[11px] text-gray-600 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isInitialized ? "Ask about my projects, skills, tech..." : isInitializing ? "Loading AI weights..." : "Click to initialize AI"}
                      disabled={!isInitialized || isLoading}
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-xs sm:text-sm outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!isInitialized || isLoading || !input.trim()}
                      className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:shadow-md transition-all shrink-0"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    100% Client-Side WebLLM & Transformers • Zero Cloud Egress
                  </p>
                </form>
              </>
            ) : (
              <div className="h-[440px]">
                <JobAnalyzer onBack={() => setActiveTab('chat')} isAIReady={isInitialized} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
