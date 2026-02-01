import React from 'react';
import { 
  Bold, Italic, Strikethrough, Heading, 
  List, ListOrdered, CheckSquare, 
  Link, Image, Code, Quote, 
  Undo, Redo, Minus, Sparkles
} from 'lucide-react';

interface EditorToolbarProps {
  editorRef: React.MutableRefObject<any>;
  onToggleAI?: () => void;
}

export const EditorToolbar = ({ editorRef, onToggleAI }: EditorToolbarProps) => {
  const insertText = (before: string, after: string = '') => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    const newText = `${before}${text}${after}`;
    
    editor.executeEdits('toolbar', [{
      range: selection,
      text: newText,
      forceMoveMarkers: true
    }]);
    
    // Restore focus and adjust cursor
    if (text.length === 0) {
      const position = {
        lineNumber: selection.startLineNumber,
        column: selection.startColumn + before.length
      };
      editor.setPosition(position);
    }
    
    editor.focus();
  };

  const insertLineStart = (prefix: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const position = editor.getPosition();
    const model = editor.getModel();
    const lineContent = model.getLineContent(position.lineNumber);
    
    // Check if line already starts with prefix
    if (!lineContent.startsWith(prefix)) {
        editor.executeEdits('toolbar', [{
            range: {
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: 1
            },
            text: prefix
        }]);
    }
    
    editor.focus();
  };

  const insertBlock = (type: 'link' | 'image' | 'table' | 'rule' | 'code') => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    let text = '';
    let cursorOffset = 0;
    let lineDelta = 0;
    
    switch (type) {
      case 'link':
        text = '[](https://)';
        cursorOffset = 1;
        break;
      case 'image':
        text = '![](https://)';
        cursorOffset = 2;
        break;
      case 'rule':
        text = '\n---\n';
        break;
      case 'code':
        text = '```\n\n```';
        lineDelta = 1; // Move 1 line down
        cursorOffset = 1; // Set column to 1 (will be handled specially)
        break;
    }

    editor.executeEdits('toolbar', [{
      range: selection,
      text: text,
      forceMoveMarkers: true
    }]);
    
    if (cursorOffset > 0 || lineDelta > 0) {
      const position = {
        lineNumber: selection.startLineNumber + lineDelta,
        column: lineDelta > 0 ? 1 : selection.startColumn + cursorOffset
      };
      editor.setPosition(position);
    }
    
    editor.focus();
  };

  const handleUndo = () => editorRef.current?.trigger('toolbar', 'undo', null);
  const handleRedo = () => editorRef.current?.trigger('toolbar', 'redo', null);

  return (
    <div className="flex items-center gap-1 p-1 bg-[#252526] border-b border-white/10 shrink-0 overflow-x-auto">
      {/* History */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-white/10 mr-2">
        <ToolbarButton onClick={handleUndo} icon={<Undo size={14} />} title="Undo" />
        <ToolbarButton onClick={handleRedo} icon={<Redo size={14} />} title="Redo" />
      </div>

      {/* Formatting */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-white/10 mr-2">
        <ToolbarButton onClick={() => insertText('**', '**')} icon={<Bold size={14} />} title="Bold" />
        <ToolbarButton onClick={() => insertText('*', '*')} icon={<Italic size={14} />} title="Italic" />
        <ToolbarButton onClick={() => insertText('~~', '~~')} icon={<Strikethrough size={14} />} title="Strikethrough" />
        <ToolbarButton onClick={() => insertLineStart('# ')} icon={<Heading size={14} />} title="Heading" />
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-white/10 mr-2">
        <ToolbarButton onClick={() => insertLineStart('- ')} icon={<List size={14} />} title="Bullet List" />
        <ToolbarButton onClick={() => insertLineStart('1. ')} icon={<ListOrdered size={14} />} title="Ordered List" />
        <ToolbarButton onClick={() => insertLineStart('- [ ] ')} icon={<CheckSquare size={14} />} title="Checklist" />
      </div>

      {/* Code */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-white/10 mr-2">
        <ToolbarButton onClick={() => insertBlock('code')} icon={<Code size={14} />} title="Code Block" />
        <ToolbarButton onClick={() => insertLineStart('> ')} icon={<Quote size={14} />} title="Blockquote" />
      </div>

      <div className="flex items-center gap-0.5">
        <ToolbarButton onClick={() => insertBlock('link')} icon={<Link size={14} />} title="Link" />
        <ToolbarButton onClick={() => insertBlock('image')} icon={<Image size={14} />} title="Image" />
        <ToolbarButton onClick={() => insertBlock('rule')} icon={<Minus size={14} />} title="Horizontal Rule" />
      </div>

       {/* AI */}
       <div className="flex items-center gap-0.5 pl-2 border-l border-white/10 ml-2">
        <ToolbarButton 
            onClick={() => onToggleAI?.()} 
            icon={<Sparkles size={14} className="text-blue-400" />} 
            title="Ask AI" 
        />
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon, title }: { onClick: () => void; icon: React.ReactNode; title: string }) => (
  <button
    onClick={onClick}
    className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
    title={title}
  >
    {icon}
  </button>
);
