import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import remarkBreaks from 'remark-breaks';
import { usePreview } from '@/modules/editor/hooks/usePreview';
import marpStyles from './MarpPreview.module.css';
import markdownStyles from './MarkdownPreview.module.css';
import { clsx } from 'clsx';

interface PreviewPanelProps {
  content: string;
  onLineClick?: (line: number) => void;
  width?: number | string;
  viewMode: 'marp' | 'markdown';
}

const MarkdownComponents: any = {
    p: ({ node, ...props }: any) => <p data-line={node?.position?.start?.line} {...props} />,
    h1: ({ node, ...props }: any) => <h1 data-line={node?.position?.start?.line} {...props} />,
    h2: ({ node, ...props }: any) => <h2 data-line={node?.position?.start?.line} {...props} />,
    h3: ({ node, ...props }: any) => <h3 data-line={node?.position?.start?.line} {...props} />,
    h4: ({ node, ...props }: any) => <h4 data-line={node?.position?.start?.line} {...props} />,
    h5: ({ node, ...props }: any) => <h5 data-line={node?.position?.start?.line} {...props} />,
    h6: ({ node, ...props }: any) => <h6 data-line={node?.position?.start?.line} {...props} />,
    li: ({ node, ...props }: any) => <li data-line={node?.position?.start?.line} {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote data-line={node?.position?.start?.line} {...props} />,
    code: ({ node, ...props }: any) => <code data-line={node?.position?.start?.line} {...props} />,
    img: ({ node, ...props }: any) => <img data-line={node?.position?.start?.line} {...props} />,
    tr: ({ node, ...props }: any) => <tr data-line={node?.position?.start?.line} {...props} />,
};

export const PreviewPanel = ({ content, onLineClick, width, viewMode }: PreviewPanelProps) => {
  const { html, css, handlePreviewClick } = usePreview(content, viewMode, onLineClick);

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
            className={clsx("marp-content", marpStyles.previewContainer)}
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        </div>
      ) : (
        <div 
            className={clsx("flex-1 w-full overflow-y-auto p-8 bg-[#1e1e1e]", markdownStyles.markdownContainer)}
            data-color-mode="dark"
            onClick={handlePreviewClick}
        >
            <MDEditor.Markdown 
                source={content} 
                className="!bg-transparent !text-[#c9d1d9]"
                components={MarkdownComponents}
                remarkPlugins={[remarkBreaks]}
            />
        </div>
      )}
    </div>
  );
};
