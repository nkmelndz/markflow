import React from 'react';
import { useMarpRender } from '@/modules/editor/hooks/useMarpRender';
import styles from './PreviewPanel.module.css';
import { clsx } from 'clsx';

interface PreviewPanelProps {
  content: string;
  onLineClick?: (line: number) => void;
}

export const PreviewPanel = ({ content, onLineClick }: PreviewPanelProps) => {
  const { html, css } = useMarpRender(content);

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onLineClick) return;

    const target = e.target as HTMLElement;
    const lineElement = target.closest('[data-line]');
    
    if (lineElement) {
      const line = parseInt(lineElement.getAttribute('data-line') || '0', 10);
      if (line > 0) {
        onLineClick(line);
      }
    }
  };

  return (
    <div 
      className="h-full flex-1 min-w-[300px] bg-[#121212] flex flex-col items-center p-8 overflow-y-auto relative"
      onClick={handlePreviewClick}
    >
        <style>{css}</style>
        <div 
          className={clsx("marp-content", styles.previewContainer)}
          dangerouslySetInnerHTML={{ __html: html }} 
        />
    </div>
  );
};
