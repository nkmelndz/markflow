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

  const exportHTML = useCallback((content: string, viewMode: 'marp' | 'markdown', filename: string = 'document.html') => {
    let htmlContent = '';

    if (viewMode === 'marp') {
      const marp = new Marp({ html: true });
      const { html, css } = marp.render(content);
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Marp Slide</title>
  <style>
    ${css}
    body { margin: 0; background: #222; }
    .marp-content { box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin: 20px auto; }
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
  <title>Markdown Document</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #0d1117;
      color: #c9d1d9;
    }
    pre { background: #161b22; padding: 16px; border-radius: 6px; overflow: auto; }
    code { font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace; }
    img { max-width: 100%; }
    a { color: #58a6ff; }
    h1, h2, h3, h4, h5, h6 { color: #ffffff; border-bottom: 1px solid #21262d; padding-bottom: .3em; }
  </style>
</head>
<body>
  ${rendered}
</body>
</html>`;
    }

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, filename);
  }, []);

  const triggerPrint = useCallback(() => {
    // Add temporary print styles
    const style = document.createElement('style');
    style.id = 'temp-print-styles';
    style.innerHTML = `
      @media print {
        @page { margin: 0; size: auto; }
        body * { visibility: hidden; }
        /* Target Marp slides container specifically */
        .marp-content, .marp-content * { 
            visibility: visible; 
        }
        .marp-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            box-shadow: none !important;
            break-after: page;
        }

        /* Target wrapper if needed */
        main { display: block !important; }
        
        /* If in normal markdown mode */
        .wmde-markdown, .wmde-markdown * { visibility: visible; }
        .wmde-markdown {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
        }
        .wmde-markdown code, .wmde-markdown pre { 
            background: #f5f5f5 !important; 
            color: black !important; 
        }
      }
    `;
    document.head.appendChild(style);

    window.print();

    // Cleanup after print dialog usage (timeout is a simple safety, though print blocks in some browsers)
    // Actually, safest is to remove it on window focus or just leave it since it's only active @media print
    // But removing is cleaner.
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  }, []);

  return { exportMarkdown, exportHTML, triggerPrint };
};
