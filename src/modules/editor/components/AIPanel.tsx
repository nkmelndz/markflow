import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils'; 

interface AIPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  isLoading?: boolean;
}

export const AIPanel = ({ isVisible, onClose, onSend, isLoading = false }: AIPanelProps) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when opened
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  // Handle enter key to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "border-t border-white/10 bg-[#1e1e1e] flex flex-col transition-all duration-300 ease-in-out font-sans",
        isVisible ? "h-auto p-4 opacity-100 translate-y-0" : "h-0 p-0 opacity-0 translate-y-4 overflow-hidden"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-blue-400">
          <Sparkles size={16} />
          <span className="text-sm font-medium">AI Assistant</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative bg-[#252526] rounded-lg border border-white/10 focus-within:border-blue-500/50 transition-colors">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI to edit or generate content (e.g., 'Add a table of contents')..."
          className="w-full bg-transparent text-sm text-white p-3 pr-10 resize-none outline-none h-[80px] placeholder:text-gray-500 font-sans"
        />
        
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute bottom-2 right-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowUp size={16} />
          )}
        </button>
      </div>
    </div>
  );
};
