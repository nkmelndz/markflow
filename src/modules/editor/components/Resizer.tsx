import React from 'react';

export const Resizer = () => {
  return (
    <div 
      className="w-1 bg-white/5 hover:bg-blue-500 cursor-col-resize transition-colors z-10 flex items-center justify-center group"
    >
        <div className="h-8 w-1 group-hover:bg-blue-400 rounded-full bg-transparent transition-colors" />
    </div>
  );
};
