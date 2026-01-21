import React from 'react';
import ReactMarkdown from 'react-markdown';
import { usePreview } from '@/modules/editor/hooks/usePreview';
import styles from './PreviewPanel.module.css';
import { clsx } from 'clsx';

interface PreviewPanelProps {
  content: string;
  onLineClick?: (line: number) => void;
  width?: number | string;
  viewMode: 'marp' | 'markdown';
}

export const PreviewPanel = ({ content, onLineClick, width, viewMode }: PreviewPanelProps) => {
  const { html, css, handlePreviewClick } = usePreview(content, onLineClick);

  return (
    <div 
      className="h-full min-w-[300px] bg-[#121212] flex flex-col relative"
      style={{ width: width }}
    >
      {viewMode === 'marp' ? (
        <div 
          className="flex-1 w-full flex flex-col items-center overflow-y-auto"
          onClick={handlePreviewClick}
        >
          <style>{css}</style>
          <div 
            className={clsx("marp-content", styles.previewContainer)}
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        </div>
      ) : (
        <div className="flex-1 w-full overflow-y-auto p-8">
          <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-a:text-blue-400">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
