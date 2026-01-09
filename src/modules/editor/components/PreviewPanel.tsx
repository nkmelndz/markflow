import React from 'react';

export const PreviewPanel = () => {
  return (
    <div className="h-full flex-1 min-w-[300px] bg-[#121212] flex items-center justify-center p-8 overflow-y-auto">
        {/* Placeholder for Marp Slide */}
        <div className="aspect-video w-full max-w-4xl bg-white rounded-xl shadow-2xl flex items-center justify-center text-black">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Marp Preview</h1>
                <p className="text-gray-500">Rendered slides will appear here</p>
            </div>
        </div>
    </div>
  );
};
