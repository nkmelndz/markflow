import React from 'react';
import Editor from '@monaco-editor/react';
import { EditorToolbar } from './EditorToolbar';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void;
}

export const CodeEditor = ({ value, onChange, onMount }: CodeEditorProps) => {
  const editorRef = React.useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  return (
    <div 
      className="h-full flex-1 min-w-0 flex flex-col bg-[#1e1e1e]"
    >
       <EditorToolbar editorRef={editorRef} />
       <div className="flex-1 min-h-0 relative">
         <Editor
          height="100%"
          defaultLanguage="markdown"
          value={value}
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
       </div>
    </div>
  );
};
