import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void;
}

export const CodeEditor = ({ value, onChange, onMount, width }: CodeEditorProps & { width?: number }) => {
  return (
    <div 
      className="h-full flex flex-col bg-[#1e1e1e]"
      style={{ width: width, minWidth: 300 }}
    >
       <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={onChange}
        onMount={onMount}
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
  );
};
