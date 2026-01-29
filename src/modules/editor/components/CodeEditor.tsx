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
    
    // Handle Enter key for list auto-continuation
    // Use addCommand with context to avoid overriding suggestion widget (accept suggestion)
    editor.addCommand(monaco.KeyCode.Enter, () => {
        const position = editor.getPosition();
        const model = editor.getModel();
        const lineContent = model.getLineContent(position.lineNumber);
        
        // Regex patterns
        const unorderedListPattern = /^(\s*)([-*]\s)(.*)$/;
        const orderedListPattern = /^(\s*)(\d+)(\.\s)(.*)$/;
        const checkListPattern = /^(\s*)(- \[[ x]\]\s)(.*)$/;
        
        // Check for matches
        const unorderedMatch = lineContent.match(unorderedListPattern);
        const orderedMatch = lineContent.match(orderedListPattern);
        const checkListMatch = lineContent.match(checkListPattern);
        
        if (unorderedMatch || orderedMatch || checkListMatch) {
            // Prioritize checkListMatch because it overlaps with unorderedMatch (starts with "- ")
            const match = checkListMatch || orderedMatch || unorderedMatch;
            const indent = match[1];
            const marker = match[2];
            const content = match[match.length - 1].trim(); // Last group is content
            
            // Check if line is empty (just the marker)
            if (content === '') {
                // Remove the list marker (toggle off)
                editor.executeEdits('auto-list', [{
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: 1,
                        endLineNumber: position.lineNumber,
                        endColumn: lineContent.length + 1
                    },
                    text: '' 
                }]);
                return;
            }
            
            let nextMarker = marker;
            
            // Handle ordered list increment
            if (orderedMatch) {
                const num = parseInt(orderedMatch[2]);
                nextMarker = `${num + 1}. `;
            }
            
            // Handle checklist reset
            if (checkListMatch) {
                nextMarker = '- [ ] ';
            }

            editor.executeEdits('auto-list', [{
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                },
                text: `\n${indent}${nextMarker}`,
                forceMoveMarkers: true
            }]);
        } else {
             // Default Enter behavior if not a list
             editor.trigger('keyboard', 'type', { text: '\n' });
        }
    }, '!suggestWidgetVisible'); // Only run if suggestion widget is NOT visible

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
       </div>
    </div>
  );
};
