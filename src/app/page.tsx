"use client"
import { EditorHeader } from '@/modules/editor/components/EditorHeader';
import { CodeEditor } from '@/modules/editor/components/CodeEditor';
import { PreviewPanel } from '@/modules/editor/components/PreviewPanel';
import { Resizer } from '@/modules/editor/components/Resizer';
import { useEditor } from '@/modules/editor/hooks/useEditor';

import { useResizable } from '@/modules/editor/hooks/useResizable';

export default function Home() {
  const { content, setContent, handleEditorDidMount, goToLine } = useEditor();
  const { width, startResizing } = useResizable({ initialWidthVw: 50 });

  return (
    <div className="flex flex-col h-screen w-full bg-[#1e1e1e] text-white overflow-hidden">
      <EditorHeader />
      
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
        />
      </main>
    </div>
  );}
