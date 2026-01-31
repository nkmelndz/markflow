import React from 'react';
import { X, Keyboard, Sparkles, FileText, Download } from 'lucide-react';

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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

          {/* Formatting Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <FileText size={18} className="text-blue-400" />
              Supported Formats
            </h3>
            <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <div>
                        <strong className="text-white">Markdown:</strong> Standard formatting. Use headers, lists, code blocks, tables, and images.
                    </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                    <div>
                        <strong className="text-white">Marp Slides:</strong> Use <code className="bg-white/10 px-1 rounded">---</code> to separate slides. View in <strong>Marp Mode</strong> to see the presentation preview.
                    </div>
                </div>
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

          {/* Shortcuts (Placeholder for future) */}
           <section>
             <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Keyboard size={18} className="text-orange-400" />
              Quick Tips
            </h3>
             <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div className="flex justify-between bg-white/5 px-3 py-2 rounded">
                    <span>Undo</span>
                    <kbd className="bg-black/40 px-1.5 rounded text-white font-mono text-xs">Cmd+Z</kbd>
                </div>
                <div className="flex justify-between bg-white/5 px-3 py-2 rounded">
                    <span>Redo</span>
                    <kbd className="bg-black/40 px-1.5 rounded text-white font-mono text-xs">Cmd+Shift+Z</kbd>
                </div>
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
