import React from 'react';
import MDEditor from '@uiw/react-md-editor';
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
        <div className="flex-1 w-full overflow-y-auto p-8 bg-[#1e1e1e]" data-color-mode="dark">
            <style jsx global>{`
              .wmde-markdown {
                background-color: transparent !important;
              }
              .wmde-markdown pre, 
              .wmde-markdown code {
                background-color: #2d2d2d !important;
              }
              .wmde-markdown table tr,
              .wmde-markdown table th,
              .wmde-markdown table td {
                background-color: transparent !important;
                border-color: #444 !important;
              }
              .wmde-markdown img {
                background-color: transparent !important;
              }
            `}</style>
            <MDEditor.Markdown source={content} style={{ backgroundColor: 'transparent', color: 'white' }} />
        </div>
      )}
    </div>
  );
};
