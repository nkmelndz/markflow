import React from 'react';
import { useMarpRender } from '@/modules/editor/hooks/useMarpRender';

interface PreviewPanelProps {
  content: string;
}

export const PreviewPanel = ({ content }: PreviewPanelProps) => {
  const { html, css } = useMarpRender(content);

  return (
    <div className="h-full flex-1 min-w-[300px] bg-[#121212] flex flex-col items-center p-8 overflow-y-auto relative">
        <style>{css}</style>
        <div 
          className="marp-content w-full max-w-4xl shadow-2xl"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
    </div>
  );
};
