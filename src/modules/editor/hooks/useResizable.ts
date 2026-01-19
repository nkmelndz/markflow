import { useState, useCallback, useEffect } from 'react';

interface UseResizableProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const useResizable = ({ 
  initialWidth = 500, 
  minWidth = 300,
  maxWidth = 1200 
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
      // Calculate new width relative to the window left edge (assuming sidebar is on left)
      // If we need more complex positioning, we might need a ref to the container
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      setWidth(newWidth);
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
