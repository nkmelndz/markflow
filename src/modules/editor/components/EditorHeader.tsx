import React from 'react';
import { Download, Share } from 'lucide-react';

interface EditorHeaderProps {
  viewMode: 'marp' | 'markdown';
  setViewMode: (mode: 'marp' | 'markdown') => void;
}

export const EditorHeader = ({ viewMode, setViewMode }: EditorHeaderProps) => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#1e1e1e] flex items-center justify-between px-6 shrink-0 relative">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white tracking-tight">markflow</h1>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <span className="text-sm font-medium text-gray-200">presentation.md</span>
        <span className="text-xs text-gray-500">Unsaved changes</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-[#121212] p-1 rounded-lg flex items-center gap-1 mr-2">
          <button
            onClick={() => setViewMode('markdown')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'markdown'
                ? 'bg-[#2d2d2d] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Doc
          </button>
          <button
            onClick={() => setViewMode('marp')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'marp'
                ? 'bg-[#2d2d2d] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Slides
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-gray-300 rounded-lg text-sm transition-colors">
          <Download size={18} />
          Export
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Share size={18} />
          Share
        </button>
      </div>
    </header>
  );
};
