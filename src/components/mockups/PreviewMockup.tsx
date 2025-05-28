
import { Eye } from "lucide-react";
import { useState } from "react";

const PreviewMockup = () => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="rounded-[2rem] bg-gray-900 p-1.5 shadow-xl">
        <div className="rounded-[1.8rem] overflow-hidden aspect-[9/19] relative">
          <div className="absolute inset-0 bg-gray-100 text-gray-800 flex flex-col">
            {/* Editor view */}
            <div className={`absolute inset-0 bg-white transition-opacity duration-300 ${isPreviewVisible ? 'opacity-0' : 'opacity-100'}`}>
              <div className="border-b border-gray-200 py-1.5 px-3 flex items-center justify-between">
                <div className="text-xs font-bold">Edit mode</div>
                <button 
                  onClick={() => setIsPreviewVisible(true)}
                  className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-md flex items-center"
                >
                  <Eye className="h-3 w-3 mr-1" /> Preview
                </button>
              </div>
              
              <div className="p-3">
                <div className="space-y-2">
                  <div className="bg-gray-100 border border-gray-300 border-dashed rounded-md p-2 text-xs flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                    <span>Profile Section</span>
                    <span className="ml-auto text-[10px] text-gray-400">Edit</span>
                  </div>
                  
                  <div className="bg-gray-100 border border-gray-300 border-dashed rounded-md p-2 text-xs flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                    <span>Link: Instagram</span>
                    <span className="ml-auto text-[10px] text-gray-400">Edit</span>
                  </div>
                  
                  <div className="bg-gray-100 border border-gray-300 border-dashed rounded-md p-2 text-xs flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
                    <span>Link: YouTube</span>
                    <span className="ml-auto text-[10px] text-gray-400">Edit</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 transition-opacity duration-300 ${isPreviewVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="border-b border-white/20 py-1.5 px-3 flex items-center justify-between">
                <div className="text-xs font-bold text-white">Preview mode</div>
                <button 
                  onClick={() => setIsPreviewVisible(false)}
                  className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-md"
                >
                  Back to edit
                </button>
              </div>
              
              <div className="flex flex-col items-center pt-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-2"></div>
                <div className="text-sm text-white font-bold">@username</div>
                <div className="text-[10px] text-white/80 mb-4">Bio description</div>
                
                <div className="w-full px-4 space-y-2">
                  <div className="bg-white/20 backdrop-blur-sm py-2 px-3 rounded-md text-white text-xs">
                    Instagram
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm py-2 px-3 rounded-md text-white text-xs">
                    YouTube
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <Eye className="h-4 w-4 text-primary" />
      </div>
      
      <div className="absolute -right-4 top-1/3 w-8 h-20">
        <div className="border-2 border-dashed border-primary h-full rounded-md"></div>
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PreviewMockup;
