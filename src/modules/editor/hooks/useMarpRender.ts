import { useMemo } from 'react';
import { Marp } from '@marp-team/marp-core';

export const useMarpRender = (content: string) => {
  return useMemo(() => {
    try {
      const marp = new Marp({ html: true });
      const { html, css } = marp.render(content);
      return { html, css };
    } catch (error) {
      console.error('Failed to render Marp slides:', error);
      return { html: '', css: '' };
    }
  }, [content]);
};
