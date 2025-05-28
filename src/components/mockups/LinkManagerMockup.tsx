
import { useState } from 'react';
import { Link } from "lucide-react";

const LinkManagerMockup = () => {
  const [isDragging, setIsDragging] = useState(false);
  
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="rounded-[2rem] bg-gray-900 p-1.5 shadow-xl">
        <div className="rounded-[1.8rem] overflow-hidden aspect-[9/19] relative">
          <div className="absolute inset-0 bg-white text-gray-800 flex flex-col pt-4 px-3">
            <h3 className="text-sm font-bold text-center mb-3">Link Manager</h3>
            
            {/* Link items */}
            <div className="space-y-2">
              <div className={`bg-gray-100 rounded-md p-2 flex items-center justify-between cursor-grab ${isDragging ? 'opacity-50' : ''}`}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
              >
                <span className="text-xs">YouTube Channel</span>
                <span className="text-gray-400">≡</span>
              </div>
              
              <div className="bg-gray-100 rounded-md p-2 flex items-center justify-between cursor-grab">
                <span className="text-xs">Instagram Profile</span>
                <span className="text-gray-400">≡</span>
              </div>
              
              <div className="bg-gray-100 rounded-md p-2 flex items-center justify-between cursor-grab relative translate-y-1 shadow-md border border-primary/20">
                <span className="text-xs">Latest Blog Post</span>
                <span className="text-gray-400">≡</span>
              </div>
              
              <div className="bg-gray-100 rounded-md p-2 flex items-center justify-between cursor-grab">
                <span className="text-xs">Portfolio Website</span>
                <span className="text-gray-400">≡</span>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-md p-2 flex items-center justify-center">
                <span className="text-xs text-gray-500">+ Add new link</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <Link className="h-4 w-4 text-primary" />
      </div>
      
      {/* Floating arrow showing drag movement */}
      <div className={`absolute -right-3 top-1/3 w-10 h-16 flex flex-col items-center transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
        <div className="w-4 h-4 border-t-4 border-r-4 border-gray-400 transform rotate-135 -mt-1"></div>
      </div>
    </div>
  );
};

export default LinkManagerMockup;
