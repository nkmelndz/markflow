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
  const [isInitialized, setIsInitialized] = useState(false);
  const editorRef = useRef<any>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('markflow_content_v1');
    if (saved) {
      setContent(saved);
    } else {
        setContent(DEFAULT_CONTENT);
    }
    setIsInitialized(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isInitialized) {
        localStorage.setItem('markflow_content_v1', content);
    }
  }, [content, isInitialized]);

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
    handleEditorDidMount,
    goToLine,
    isInitialized
  };
};
