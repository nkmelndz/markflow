import { useState, useCallback, useEffect } from 'react';

interface UseResizableProps {
  initialWidthVw?: number; // VW percentage (0-100)
  minWidth?: number;
  maxWidth?: number;
}

export const useResizable = ({ 
  initialWidthVw = 50,
  minWidth = 300,
  maxWidth = 1200,
}: UseResizableProps = {}) => {
  const [width, setWidth] = useState<number | string>(`${initialWidthVw}vw`);
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
      // Calculate new width relative to the window right edge
      const newWidthPx = window.innerWidth - e.clientX;
      
      // Convert to percentage of current window width
      const vwValue = (newWidthPx / window.innerWidth) * 100;
      
      // Clamp between min/max (converting min/max logic to appx percentage check or just keep pixels? 
      // Strictly speaking, minWidth/maxWidth props are numbers (pixels). 
      // We should check the pixel value against constraints, THEN convert to VW.)
      
      const clampedPx = Math.min(Math.max(newWidthPx, minWidth), maxWidth);
      const finalVw = (clampedPx / window.innerWidth) * 100;
      
      setWidth(`${finalVw}vw`);
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
