"use client"
import { EditorHeader } from '@/modules/editor/components/EditorHeader';
import { CodeEditor } from '@/modules/editor/components/CodeEditor';
import { PreviewPanel } from '@/modules/editor/components/PreviewPanel';
import { Resizer } from '@/modules/editor/components/Resizer';

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-[#1e1e1e] text-white overflow-hidden">
      <EditorHeader />
      
      <main className="flex-1 flex flex-row overflow-hidden relative">
        <CodeEditor />
        <Resizer />
        <PreviewPanel />
      </main>
    </div>
  );}
