"use client"
import { useState } from 'react';
import { EditorHeader } from '@/modules/editor/components/EditorHeader';
import { CodeEditor } from '@/modules/editor/components/CodeEditor';
import { PreviewPanel } from '@/modules/editor/components/PreviewPanel';
import { Resizer } from '@/modules/editor/components/Resizer';
import { useEditor } from '@/modules/editor/hooks/useEditor';

import { useResizable } from '@/modules/editor/hooks/useResizable';

export default function Home() {
  const { content, setContent, handleEditorDidMount, goToLine, isInitialized } = useEditor();
  const { width, startResizing } = useResizable({ initialWidthVw: 50 });
  const [viewMode, setViewMode] = useState<'marp' | 'markdown'>('markdown');

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
      <EditorHeader viewMode={viewMode} setViewMode={setViewMode} />
      
      <main className="flex-1 flex flex-row overflow-hidden relative">
        <CodeEditor 
          value={content} 
          onChange={(val) => setContent(val || '')} 
          onMount={handleEditorDidMount}
        />
        <Resizer onMouseDown={startResizing} />
        <PreviewPanel 
          content={content} 
          onLineClick={goToLine}
          width={width}
          viewMode={viewMode}
        />
      </main>
    </div>
  );
}
