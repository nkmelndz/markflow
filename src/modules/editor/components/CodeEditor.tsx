import React from 'react';
import Editor from '@monaco-editor/react';
import { EditorToolbar } from './EditorToolbar';
import { AIPanel } from './AIPanel';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void;
}

export const CodeEditor = ({ value, onChange, onMount }: CodeEditorProps) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = React.useState(false);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);
  const editorRef = React.useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const handleAISend = async (instruction: string) => {
    const editor = editorRef.current;
    if (!editor || isLoadingAI) return;

    setIsLoadingAI(true);
    
    try {
        const model = editor.getModel();
        const fullContent = model.getValue();
        
        // Prepare context: if selection exists, focus on it, otherwise use full content
        // But for the API, we decided to send full content as context to give LLM awareness, 
        // and let it know what to do via instruction.
        // However, to make the *result* application easier, checking selection is useful.
        
        const context = fullContent; // Sending full content is safer for "awareness"
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ instruction, context })
        });

        const data = await response.json();

        if (data.error) {
            console.error('AI Error:', data.error);
            // Optionally show toast/alert
            alert(`AI Error: ${data.error}`);
            return;
        }

        const generatedText = data.generatedText;

        if (generatedText) {
             // Logic: Full File Replacement Strategy
             // To avoid duplication or misplaced insertions, we replace the entire model content.
             const fullRange = model.getFullModelRange();
            
             editor.executeEdits('ai-generate', [{
                range: fullRange,
                text: generatedText,
                forceMoveMarkers: true
            }]);
            
            // pushUndoStop() is often automatic with executeEdits in recent monaco versions, 
            // but ensuring it's treated as a single undoable action is good.
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
