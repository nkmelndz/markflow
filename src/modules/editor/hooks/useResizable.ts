import { useState, useCallback, useEffect } from 'react';

interface UseResizableProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const useResizable = ({ 
  initialWidth = 500, 
  minWidth = 300,
  maxWidth = 1200,
}: UseResizableProps = {}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      // For right panel: width = window.innerWidth - mouseX
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setWidth(clampedWidth);
    }
  }, [isResizing, minWidth, maxWidth]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return {
    width,
    startResizing,
    isResizing,
  };
};
