import React from 'react';
import Editor from '@monaco-editor/react';
import { EditorToolbar } from './EditorToolbar';
import { AIPanel } from './AIPanel';
import { useRateLimit } from '../hooks/useRateLimit';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void;
}

export const CodeEditor = ({ value, onChange, onMount }: CodeEditorProps) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = React.useState(true);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);
  const editorRef = React.useRef<any>(null);
  const { checkLimit, incrementUsage, remaining } = useRateLimit();

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const handleAISend = async (instruction: string) => {
    const editor = editorRef.current;
    if (!editor || isLoadingAI) return;

    if (!checkLimit()) {
        alert('Daily limit reached (15 queries). Please try again tomorrow.');
        return;
    }

    setIsLoadingAI(true);
    
    try {
        const model = editor.getModel();
        const fullContent = model.getValue();
        const context = fullContent;
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ instruction, context })
        });

        const data = await response.json();

        if (data.error) {
            console.error('AI Error:', data.error);
            alert(`AI Error: ${data.error}`);
            return;
        }

        const generatedText = data.generatedText;

        if (generatedText) {
             const fullRange = model.getFullModelRange();
             editor.executeEdits('ai-generate', [{
                range: fullRange,
                text: generatedText,
                forceMoveMarkers: true
            }]);
            
            // Increment usage only on success
            incrementUsage();
        }

    } catch (err) {
        console.error('Request failed', err);
        alert('Failed to generate content');
    } finally {
        setIsLoadingAI(false);
    }
  };

  return (
    <div 
      className="h-full flex-1 min-w-0 flex flex-col bg-[#1e1e1e]"
    >
       <EditorToolbar 
         editorRef={editorRef} 
         onToggleAI={() => setIsAIPanelOpen(!isAIPanelOpen)}
       />
       <div className="flex-1 min-h-0 relative">
         <Editor
          height="100%"
          defaultLanguage="markdown"
          defaultValue={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            padding: { top: 20 },
            scrollBeyondLastLine: false,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            snippetSuggestions: 'none',
            wordBasedSuggestions: 'off',
          }}
         />
         
         {isLoadingAI && (
            <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center animate-pulse"></div>
         )}
       </div>
       
       {isAIPanelOpen && (
         <AIPanel 
           isVisible={isAIPanelOpen} 
           onClose={() => setIsAIPanelOpen(false)} 
           onSend={handleAISend}
           isLoading={isLoadingAI}
         />
       )}
    </div>
  );
};
