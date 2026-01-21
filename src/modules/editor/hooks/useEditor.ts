import { useState, useRef, useEffect } from 'react';

const DEFAULT_CONTENT = `
# Welcome to Markflow

Start writing your content here.

---

## Features

- **Markdown Support**: Write standard markdown.
- **Marp Slides**: Transform text into presentations.
- **Real-time Preview**: See changes instantly.
`;

export const useEditor = () => {
  const [content, setContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('presentation');
  const [viewMode, setViewMode] = useState<'marp' | 'markdown'>('markdown');
  const [layoutMode, setLayoutMode] = useState<'editor' | 'split' | 'preview'>('split');
  const [isInitialized, setIsInitialized] = useState(false);
  const editorRef = useRef<any>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('markflow_content_v1');
    const savedViewMode = localStorage.getItem('markflow_viewmode_v1');
    const savedLayoutMode = localStorage.getItem('markflow_layoutmode_v1');
    const savedFileName = localStorage.getItem('markflow_filename_v1');
    
    if (savedContent) {
      setContent(savedContent);
    } else {
        setContent(DEFAULT_CONTENT);
    }

    if (savedFileName) {
        setFileName(savedFileName);
    }

    if (savedViewMode === 'marp' || savedViewMode === 'markdown') {
      setViewMode(savedViewMode as 'marp' | 'markdown');
    }

    if (savedLayoutMode === 'editor' || savedLayoutMode === 'split' || savedLayoutMode === 'preview') {
      setLayoutMode(savedLayoutMode as 'editor' | 'split' | 'preview');
    }

    setIsInitialized(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isInitialized) {
        localStorage.setItem('markflow_content_v1', content);
        localStorage.setItem('markflow_viewmode_v1', viewMode);
        localStorage.setItem('markflow_layoutmode_v1', layoutMode);
        localStorage.setItem('markflow_filename_v1', fileName);
    }
  }, [content, viewMode, layoutMode, fileName, isInitialized]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const goToLine = (line: number) => {
    const editor = editorRef.current;
    if (!editor) return;

    // Ensure line is within bounds
    const maxLine = editor.getModel()?.getLineCount() || 0;
    const targetLine = Math.max(1, Math.min(line, maxLine));

    editor.revealLineInCenter(targetLine);
    editor.setPosition({ lineNumber: targetLine, column: 1 });
    editor.focus();
  };

  return {
    content,
    setContent,
    viewMode,
    setViewMode,
    layoutMode,
    setLayoutMode,
    handleEditorDidMount,
    goToLine,
    isInitialized,
    fileName,
    setFileName
  };
};
