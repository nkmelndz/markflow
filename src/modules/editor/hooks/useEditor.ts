import { useState, useRef, useEffect } from 'react';
import { DEFAULT_CONTENT } from '@/modules/editor/constants/defaultContent';

export const useEditor = () => {
  const [content, setContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('Untitled');
  const [viewMode, setViewMode] = useState<'marp' | 'markdown'>('markdown');
  const [layoutMode, setLayoutMode] = useState<'editor' | 'split' | 'preview'>('split');
  const [isInitialized, setIsInitialized] = useState(false);
  const editorRef = useRef<any>(null);

  const [isTitleManual, setIsTitleManual] = useState(false);
  const [hasAutoUpdated, setHasAutoUpdated] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('markflow_content_v1');
    const savedViewMode = localStorage.getItem('markflow_viewmode_v1');
    const savedLayoutMode = localStorage.getItem('markflow_layoutmode_v1');
    const savedFileName = localStorage.getItem('markflow_filename_v1');
    const savedIsTitleManual = localStorage.getItem('markflow_istitlemanual_v1');
    const savedHasAutoUpdated = localStorage.getItem('markflow_hasautoupdated_v1');
    
    if (savedContent) {
      setContent(savedContent);
    } else {
        setContent(DEFAULT_CONTENT);
    }

    if (savedFileName) {
        setFileName(savedFileName);
    }
    
    if (savedIsTitleManual === 'true') {
        setIsTitleManual(true);
    }
    
    if (savedHasAutoUpdated === 'true') {
        setHasAutoUpdated(true);
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
        localStorage.setItem('markflow_istitlemanual_v1', String(isTitleManual));
        localStorage.setItem('markflow_hasautoupdated_v1', String(hasAutoUpdated));
    }
  }, [content, viewMode, layoutMode, fileName, isInitialized, isTitleManual, hasAutoUpdated]);

  // Auto-update title from content
  useEffect(() => {
    if (isInitialized && !isTitleManual && !hasAutoUpdated) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch && titleMatch[1]) {
            setFileName(titleMatch[1].trim());
            setHasAutoUpdated(true);
        }
    }
  }, [content, isInitialized, isTitleManual, hasAutoUpdated]);

  // Update document title
  useEffect(() => {
    document.title = `${fileName || 'Untitled'} - Markflow`;
  }, [fileName]);

  const updateFileName = (name: string) => {
    setFileName(name);
    setIsTitleManual(true);
  };

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
    setFileName: updateFileName
  };
};
