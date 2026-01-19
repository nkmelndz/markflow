import { useState, useRef } from 'react';

const DEFAULT_CONTENT = `---
marp: true
theme: default
---

# Hello Marp!

This is a slide.

---

# Another Slide

- Bullet point 1
- Bullet point 2
`;

export const useEditor = () => {
  const [content, setContent] = useState<string>(DEFAULT_CONTENT);
  const editorRef = useRef<any>(null);

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
  };
};
