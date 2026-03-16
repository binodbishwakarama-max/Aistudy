import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import { chatWithAI } from '../services/api';
import { Send, Bot, User, X, MessageSquare, Minimize2 } from 'lucide-react';
import Markdown from 'react-markdown';

const ChatInterface = () => {
  const { text } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm MindFlow AI. I've read your notes. Ask me anything! 🧠" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    const newHistory = [...messages, { role: 'user', content: userMessage }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await chatWithAI(userMessage, text, newHistory.slice(-6));
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[var(--accent)] rounded-xl shadow-lg flex items-center justify-center text-white hover:bg-[var(--accent-light)] transition-mindflow glow-shadow"
        title="Ask AI Tutor"
      >
        <MessageSquare size={24} />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[var(--success)] rounded-full border-2 border-[var(--bg-base)]" />
      </motion.button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-64 glass-card rounded-xl overflow-hidden border-[var(--border-accent)]">
        <div
          className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-elevated)] transition-mindflow"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-2 text-[var(--text-primary)] text-sm font-semibold">
            <Bot size={16} className="text-[var(--accent)]" />
            <span>AI Tutor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] flex flex-col glass-card rounded-2xl border-[var(--border-accent)] overflow-hidden glow-shadow"
    >
      <div className="bg-[var(--bg-elevated)] px-4 py-3.5 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center">
            <Bot size={18} className="text-[var(--accent-light)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-none text-[var(--text-primary)]">MindFlow AI</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-lg transition-mindflow"
          >
            <Minimize2 size={15} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-mindflow"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-surface)]/50">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]'
              }`}
            >
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>

            <div
              className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-xl ${
                msg.role === 'user'
                  ? 'bg-[var(--accent)]/20 text-[var(--text-primary)] border border-[var(--border-accent)] rounded-tr-sm'
                  : 'glass-card text-[var(--text-secondary)] rounded-tl-sm'
              }`}
            >
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-invert">
                  <Markdown>{msg.content}</Markdown>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="glass-card px-4 py-3 rounded-xl rounded-tl-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border)]">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your notes..."
            disabled={loading}
            className="flex-1 px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] outline-none transition-mindflow placeholder:text-[var(--text-muted)] text-sm font-medium text-[var(--text-primary)]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-light)] disabled:opacity-30 transition-mindflow"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
