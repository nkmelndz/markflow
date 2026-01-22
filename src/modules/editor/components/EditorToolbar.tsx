import React from 'react';
import { 
  Bold, Italic, Strikethrough, Heading, 
  List, ListOrdered, CheckSquare, 
  Link, Image, Code, Quote, 
  Undo, Redo, Minus 
} from 'lucide-react';

interface EditorToolbarProps {
  editorRef: React.MutableRefObject<any>;
}

export const EditorToolbar = ({ editorRef }: EditorToolbarProps) => {
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

  const insertBlock = (type: 'link' | 'image' | 'table' | 'rule') => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    let text = '';
    
    switch (type) {
      case 'link':
        text = '[Link text](url)';
        break;
      case 'image':
        text = '![Alt text](url)';
        break;
      case 'rule':
        text = '\n---\n';
        break;
    }

    editor.executeEdits('toolbar', [{
      range: selection,
      text: text,
      forceMoveMarkers: true
    }]);
    
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
        <ToolbarButton onClick={() => insertText('`', '`')} icon={<Code size={14} />} title="Inline Code" />
        <ToolbarButton onClick={() => insertLineStart('> ')} icon={<Quote size={14} />} title="Blockquote" />
      </div>

      {/* Insert */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton onClick={() => insertBlock('link')} icon={<Link size={14} />} title="Link" />
        <ToolbarButton onClick={() => insertBlock('image')} icon={<Image size={14} />} title="Image" />
        <ToolbarButton onClick={() => insertBlock('rule')} icon={<Minus size={14} />} title="Horizontal Rule" />
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
