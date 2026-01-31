import React from 'react';
import { X, Sparkles, Download, PenLine, Heart } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal = ({ onClose }: HelpModalProps) => {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-400">Markflow</span> Guide
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* AI Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Sparkles size={18} className="text-purple-400" />
              AI Assistant
            </h3>
            <div className="bg-white/5 rounded-lg p-4 space-y-3 text-sm text-gray-300">
              <p>
                Use the <strong className="text-white">Sparkles</strong> button in the toolbar to ask the AI to generate or modify content.
                <span className="block text-xs text-yellow-500/80 mt-1">
                  Note: The virtual assistant may take up to 15 seconds to respond in some cases.
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-black/20 p-3 rounded border border-white/5">
                  <strong className="text-blue-300 block mb-1">Articles & Notes</strong>
                  <p className="text-xs text-gray-400">Ask for "Article", "Blog post", or "Summary".</p>
                  <code className="text-xs bg-black/40 px-1 py-0.5 rounded text-green-300 block mt-2">
                    "Write a blog post about React hooks"
                  </code>
                </div>
                <div className="bg-black/20 p-3 rounded border border-white/5">
                  <strong className="text-pink-300 block mb-1">Presentations</strong>
                  <p className="text-xs text-gray-400">Ask for "Slides", "Presentation", or "Deck".</p>
                  <code className="text-xs bg-black/40 px-1 py-0.5 rounded text-green-300 block mt-2">
                    "Create a presentation about Space X"
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Toolbar Guide */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <PenLine size={18} className="text-blue-400" />
              Toolbar Guide
            </h3>
            <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-300 space-y-2">
                <p>
                    The editor toolbar provides quick access to common formatting options. You can easily <strong>Bold</strong>, <em>Italicize</em>, or <span className="line-through">Strikethrough</span> text.
                </p>
                <p>
                    Create lists (bullet, ordered, or checklists), add links, images, code blocks, and blockquotes. Use the AI button to get intelligent writing assistance directly in your document.
                </p>
            </div>
          </section>
          {/* Export Section */}
          <section>
             <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Download size={18} className="text-green-400" />
              Export & PDF
            </h3>
            <p className="text-sm text-gray-300 mb-2">
                Click <strong>Export</strong> in the header to save your work.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1 ml-1">
                <li><strong className="text-gray-200">PDF:</strong> Uses the browser's print dialog. Ensure "Headers & Footers" is unchecked for best results.</li>
                <li><strong className="text-gray-200">HTML:</strong> Saves a standalone HTML file.</li>
                <li><strong className="text-gray-200">Markdown:</strong> Saves the raw source file.</li>
            </ul>
          </section>

          {/* Support Section */}
          <section>
             <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Heart size={18} className="text-red-400" />
              Support Markflow
            </h3>
            <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-lg p-4 border border-pink-500/20">
                <p className="text-sm text-gray-300 mb-3">
                    If you find Markflow useful, consider supporting its development. Your support helps keep the project alive!
                </p>
                <a 
                    href="https://buymeacoffee.com/markflow" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FFDD00] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#FFDD00]/90 transition-colors"
                >
                   <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee" className="w-4 h-4" />
                   Buy me a coffee
                </a>
            </div>
          </section>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#121212] text-center">
            <p className="text-xs text-gray-500">
                Markflow v1.0 • Powered by Gemini AI
            </p>
        </div>
      </div>
    </div>
  );
};
