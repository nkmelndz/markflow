import React from 'react';
import Editor from '@monaco-editor/react';

export const CodeEditor = () => {
  return (
    <div className="h-full w-1/2 min-w-[300px] flex flex-col bg-[#1e1e1e]">
       <Editor
        height="100%"
        defaultLanguage="markdown"
        defaultValue="# Hello Marp"
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          padding: { top: 20 },
          scrollBeyondLastLine: false,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
       />
    </div>
  );
};
