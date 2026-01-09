import React from 'react';
import { Save, Share, Menu } from 'lucide-react';

export const EditorHeader = () => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#1e1e1e] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-200">presentation.md</span>
          <span className="text-xs text-gray-500">Unsaved changes</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-gray-300 rounded-lg text-sm transition-colors">
          <Save size={18} />
          Save
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Share size={18} />
          Export
        </button>
      </div>
    </header>
  );
};
