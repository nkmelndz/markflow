import React from 'react';
import { Download, Share2, PenLine, Columns, Eye, FileText, Presentation, FileCode, Printer } from 'lucide-react';
import { useExport } from '../hooks/useExport';

interface EditorHeaderProps {
  viewMode: 'marp' | 'markdown';
  setViewMode: (mode: 'marp' | 'markdown') => void;
  layoutMode: 'editor' | 'split' | 'preview';
  setLayoutMode: (mode: 'editor' | 'split' | 'preview') => void;
  content: string;
  fileName: string;
  setFileName: (name: string) => void;
}

export const EditorHeader = ({ viewMode, setViewMode, layoutMode, setLayoutMode, content, fileName, setFileName }: EditorHeaderProps) => {
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const exportMenuRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { exportMarkdown, exportHTML, triggerPrint } = useExport();

  React.useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = (type: 'md' | 'html' | 'pdf') => {
    const safeFileName = fileName.trim() || 'Untitled';
    if (type === 'md') {
      exportMarkdown(content, `${safeFileName}.md`);
    } else if (type === 'html') {
      exportHTML(content, viewMode, `${safeFileName}.html`);
    } else if (type === 'pdf') {
      triggerPrint();
    }
    setIsExportOpen(false);
  };

  return (
    <header className="h-14 border-b border-white/10 bg-[#1e1e1e] flex items-center justify-between px-6 shrink-0 relative">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">markflow</h1>
        
        <div className="flex items-center gap-3">
            {/* Layout Toggles */}
            <div className="bg-[#121212] p-1 rounded-lg flex items-center gap-1">
            <button
                onClick={() => setLayoutMode('editor')}
                className={`p-1.5 rounded-md transition-all ${
                layoutMode === 'editor'
                    ? 'bg-[#2d2d2d] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Editor only"
            >
                <PenLine size={16} />
            </button>
            <button
                onClick={() => setLayoutMode('split')}
                className={`p-1.5 rounded-md transition-all ${
                layoutMode === 'split'
                    ? 'bg-[#2d2d2d] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Split view"
            >
                <Columns size={16} />
            </button>
            <button
                onClick={() => setLayoutMode('preview')}
                className={`p-1.5 rounded-md transition-all ${
                layoutMode === 'preview'
                    ? 'bg-[#2d2d2d] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Preview only"
            >
                <Eye size={16} />
            </button>
            </div>

            {/* View Mode Toggles */}
            <div className="bg-[#121212] p-1 rounded-lg flex items-center gap-1">
            <button
                onClick={() => setViewMode('markdown')}
                className={`p-1.5 rounded-md transition-all ${
                viewMode === 'markdown'
                    ? 'bg-[#2d2d2d] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Markdown Document"
            >
                <FileText size={16} />
            </button>
            <button
                onClick={() => setViewMode('marp')}
                className={`p-1.5 rounded-md transition-all ${
                viewMode === 'marp'
                    ? 'bg-[#2d2d2d] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Marp Presentation"
            >
                <Presentation size={16} />
            </button>
            </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {isEditingName ? (
            <input
                ref={inputRef}
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingName(false);
                }}
                maxLength={40}
                className="bg-transparent text-[16px] font-bold text-gray-200 text-center border-b border-blue-500 focus:outline-none px-1"
                style={{ width: `${Math.min(Math.max(fileName.length, 10), 40)}ch` }}
            />
        ) : (
            <span 
                onClick={() => setIsEditingName(true)}
                className="text-[16px] font-bold text-gray-200 cursor-pointer hover:text-white hover:bg-white/5 py-1 px-2 rounded transition-colors"
            >
                {fileName || 'Untitled'}
            </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={exportMenuRef}>
          <button 
            onClick={() => setIsExportOpen(!isExportOpen)}
            className={`flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-gray-300 rounded-lg text-sm transition-colors ${isExportOpen ? 'bg-white/5 text-white' : ''}`}
          >
            <Download size={18} />
            Export
          </button>

          {isExportOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1e1e1e] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-1">
                <button 
                  onClick={() => handleExport('md')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-md text-left transition-colors"
                >
                  <FileText size={16} />
                  <span>Markdown (.md)</span>
                </button>
                <button 
                  onClick={() => handleExport('html')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-md text-left transition-colors"
                >
                  <FileCode size={16} />
                  <span>HTML (.html)</span>
                </button>
                <button 
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-md text-left transition-colors"
                >
                  <Printer size={16} />
                  <span>PDF / Print</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Share2 size={18} />
          Share
        </button>
      </div>
    </header>
  );
};
