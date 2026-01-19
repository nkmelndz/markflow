import { useMemo } from 'react';
import { Marp } from '@marp-team/marp-core';

export const usePreview = (content: string, onLineClick?: (line: number) => void) => {
  const { html, css } = useMemo(() => {
    try {
      const marp = new Marp({ html: true });

      // Inject source map data (line numbers) for synchronization
      marp.markdown.core.ruler.push('source_map_data_line', (state: any) => {
        state.tokens.forEach((token: any) => {
          if (token.map) {
            token.attrSet('data-line', String(token.map[0] + 1));
          }
        });
      });

      const { html, css } = marp.render(content);
      return { html, css };
    } catch (error) {
      console.error('Failed to render Marp slides:', error);
      return { html: '', css: '' };
    }
  }, [content]);

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onLineClick) return;

    const target = e.target as HTMLElement;
    const lineElement = target.closest('[data-line]');
    
    if (lineElement) {
      // Ignore clicks on the slide container itself (SECTION)
      // We only want to jump when clicking specific content
      if (lineElement.tagName === 'SECTION') return;

      const line = parseInt(lineElement.getAttribute('data-line') || '0', 10);
      if (line > 0) {
        onLineClick(line);
      }
    }
  };

  return { html, css, handlePreviewClick };
};
