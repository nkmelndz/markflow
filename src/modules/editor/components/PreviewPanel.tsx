import React from 'react';
import { usePreview } from '@/modules/editor/hooks/usePreview';
import styles from './PreviewPanel.module.css';
import { clsx } from 'clsx';

interface PreviewPanelProps {
  content: string;
  onLineClick?: (line: number) => void;
}

export const PreviewPanel = ({ content, onLineClick, width }: PreviewPanelProps & { width?: number }) => {
  const { html, css, handlePreviewClick } = usePreview(content);

  return (
    <div 
      className="h-full min-w-[300px] bg-[#121212] flex flex-col items-center overflow-y-auto relative"
      onClick={handlePreviewClick}
      style={{ width: width }}
    >
        <style>{css}</style>
        <div 
          className={clsx("marp-content", styles.previewContainer)}
          dangerouslySetInnerHTML={{ __html: html }} 
        />
    </div>
  );
};
