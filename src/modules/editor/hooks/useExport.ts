import { useCallback } from 'react';
import { Marp } from '@marp-team/marp-core';
import markdownit from 'markdown-it';

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
      const md = markdownit({ html: true });
      const rendered = md.render(content);
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
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
    code { font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace; }
    img { max-width: 100%; }
    a { color: #0969da; }
    h1, h2, h3, h4, h5, h6 { color: #24292f; border-bottom: 1px solid #d0d7de; padding-bottom: .3em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d0d7de; padding: 6px 13px; }
    tr:nth-child(2n) { background-color: #f6f8fa; }
  </style>
</head>
<body>
  ${rendered}
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

  const triggerPrint = useCallback((content: string, viewMode: 'marp' | 'markdown') => {
    const htmlContent = generateFullHTML(content, viewMode, 'Print');
    
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
