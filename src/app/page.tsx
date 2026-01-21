"use client"

import { EditorHeader } from '@/modules/editor/components/Header';
import { CodeEditor } from '@/modules/editor/components/CodeEditor';
import { PreviewPanel } from '@/modules/editor/components/PreviewPanel';
import { Resizer } from '@/modules/editor/components/Resizer';
import { useEditor } from '@/modules/editor/hooks/useEditor';

import { useResizable } from '@/modules/editor/hooks/useResizable';

export default function Home() {
  const { 
    content, 
    setContent, 
    viewMode, 
    setViewMode, 
    layoutMode,
    setLayoutMode,
    handleEditorDidMount, 
    goToLine, 
    isInitialized 
  } = useEditor();
  const { width, startResizing } = useResizable({ initialWidthVw: 50 });

  if (!isInitialized) {
    return (
      <div className="h-screen w-full bg-[#1e1e1e] flex items-center justify-center flex-col gap-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <h1 className="text-8xl font-black text-white tracking-tighter lowercase font-sans">markflow</h1>
            <span className="text-gray-500 text-lg tracking-[0.2em] lowercase font-light font-sans">editor</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#1e1e1e] text-white overflow-hidden">
      <EditorHeader 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
      />
      
      <main className="flex-1 flex flex-row overflow-hidden relative">
        {(layoutMode === 'editor' || layoutMode === 'split') && (
          <div className={`${layoutMode === 'editor' ? 'w-full' : ''}`} style={layoutMode === 'split' ? { width: `${width}vw` } : undefined}>
            <CodeEditor 
              value={content} 
              onChange={(val) => setContent(val || '')} 
              onMount={handleEditorDidMount}
            />
          </div>
        )}

        {layoutMode === 'split' && (
           <Resizer onMouseDown={startResizing} />
        )}

        {(layoutMode === 'preview' || layoutMode === 'split') && (
          <div className={`${layoutMode === 'preview' ? 'w-full' : 'flex-1 min-w-0'}`}>
            <PreviewPanel 
              content={content} 
              onLineClick={goToLine}
              width={layoutMode === 'preview' ? '100%' : '100%'}
              viewMode={viewMode}
            />
          </div>
        )}
      </main>
    </div>
  );
}
