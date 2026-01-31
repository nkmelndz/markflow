import { useCallback } from 'react';
import { Marp } from '@marp-team/marp-core';
import MDEditor from '@uiw/react-md-editor';
import { renderToStaticMarkup } from 'react-dom/server';

export const useExport = () => {
  
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = useCallback((content: string, filename: string = 'document.md') => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, filename);
  }, []);

  const generateFullHTML = (content: string, viewMode: 'marp' | 'markdown', filename: string) => {
    let htmlContent = '';

    if (viewMode === 'marp') {
      const marp = new Marp({ html: true });
      const { html, css } = marp.render(content);
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    ${css}
    body { margin: 0; background: white; }
    .marp-content { box-shadow: none; margin: 0 auto; break-after: page; }
    @media print {
        @page { size: landscape; margin: 0; }
        .marp-content { break-after: page; page-break-after: always; }
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
    } else {
      // Use renderToStaticMarkup to convert the React component to HTML string
      const rendered = renderToStaticMarkup(
        <MDEditor.Markdown 
            source={content} 
            style={{ 
                backgroundColor: 'transparent', 
                color: 'inherit' 
            }} 
        />
      );
      
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: black;
      background: white;
    }
    
    /* MDEditor Styles Replication for Print/Export */
    .wmde-markdown {
        background-color: transparent !important;
        font-family: inherit;
        font-size: 16px;
    }
    
    .wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3 {
        border-bottom: 1px solid #d0d7de;
        padding-bottom: .3em;
        color: #24292f;
    }

    .wmde-markdown pre { background: #f6f8fa !important; padding: 16px; border-radius: 6px; overflow: auto; }
    .wmde-markdown code { background: rgba(175, 184, 193, 0.2); border-radius: 6px; font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace; }
    .wmde-markdown pre code { background: transparent; }
    
    .wmde-markdown table { border-collapse: collapse; width: 100%; margin-top: 0; margin-bottom: 16px; }
    .wmde-markdown table tr { background-color: #ffffff; border-top: 1px solid #d8dee4; }
    .wmde-markdown table tr:nth-child(2n) { background-color: #f6f8fa; }
    .wmde-markdown table th, .wmde-markdown table td { border: 1px solid #d0d7de; padding: 6px 13px; }
    
    .wmde-markdown a { color: #0969da; text-decoration: none; }
    .wmde-markdown a:hover { text-decoration: underline; }
    .wmde-markdown img { max-width: 100%; box-sizing: content-box; background-color: transparent; }
    
    /* Hide interactive elements for export */
    .wmde-markdown h1 > a[aria-hidden="true"],
    .wmde-markdown h2 > a[aria-hidden="true"],
    .wmde-markdown h3 > a[aria-hidden="true"],
    .wmde-markdown h4 > a[aria-hidden="true"],
    .wmde-markdown h5 > a[aria-hidden="true"],
    .wmde-markdown h6 > a[aria-hidden="true"] {
        display: none !important;
    }
    
    /* Aggressively hide all buttons and potential copy icons */
    .wmde-markdown button,
    .wmde-markdown .wc-copy-btn,
    .wmde-markdown .copied,
    .wmde-markdown svg.octicon-copy,
    .wmde-markdown svg.octicon-check { 
        display: none !important; 
    }

    /* Remove bullets from task lists */
    .wmde-markdown ul.contains-task-list {
        list-style: none !important;
        padding-left: 0 !important;
    }
    .wmde-markdown li.task-list-item {
        list-style: none !important;
    }
  </style>
</head>
<body>
  <div class="wmde-markdown">
    ${rendered}
  </div>
</body>
</html>`;
    }
    return htmlContent;
  };

  const exportHTML = useCallback((content: string, viewMode: 'marp' | 'markdown', filename: string = 'document.html') => {
    const htmlContent = generateFullHTML(content, viewMode, filename);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, filename);
  }, []);

  const triggerPrint = useCallback((content: string, viewMode: 'marp' | 'markdown', filename: string = 'Document') => {
    const htmlContent = generateFullHTML(content, viewMode, filename);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();

        // Wait for resources to load then print
        iframe.contentWindow?.focus();
        setTimeout(() => {
            iframe.contentWindow?.print();
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);
    }
  }, []);

  return { exportMarkdown, exportHTML, triggerPrint };
};
