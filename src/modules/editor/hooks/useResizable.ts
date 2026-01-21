import { useState, useCallback, useEffect } from 'react';

interface UseResizableProps {
  initialWidthVw?: number; // VW percentage (0-100)
  minWidth?: number;
  maxWidth?: number;
  minRightWidth?: number;
}

export const useResizable = ({ 
  initialWidthVw = 50,
  minWidth = 300,
  maxWidth = 4000,
  minRightWidth = 300,
}: UseResizableProps = {}) => {
  const [width, setWidth] = useState<number>(initialWidthVw);
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
      // Calculate new width relative to the window left edge (Left-based)
      const newWidthPx = e.clientX;
      
      // Calculate max allowed width based on window width and minRightWidth
      const maxAllowedWidth = window.innerWidth - minRightWidth;
      
      // Clamp between min and max constraints
      const clampedPx = Math.min(Math.max(newWidthPx, minWidth), maxWidth, maxAllowedWidth);
      const finalVw = (clampedPx / window.innerWidth) * 100;
      
      setWidth(finalVw);
    }
  }, [isResizing, minWidth, maxWidth, minRightWidth]);

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
