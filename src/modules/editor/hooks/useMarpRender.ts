import { useMemo } from 'react';
import { Marp } from '@marp-team/marp-core';

export const useMarpRender = (content: string) => {
  return useMemo(() => {
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
};
