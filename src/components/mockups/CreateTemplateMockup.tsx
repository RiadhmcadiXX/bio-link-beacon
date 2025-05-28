
import { useState } from 'react';
import { FileCode, PanelTop, Layers, SquarePen, Palette } from "lucide-react";

const CreateTemplateMockup = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>('button');
  
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="rounded-[2rem] bg-gray-900 p-1.5 shadow-xl">
        <div className="rounded-[1.8rem] overflow-hidden aspect-[9/19] relative">
          <div className="absolute inset-0 bg-gray-100 text-gray-800 flex flex-col">
            {/* Header */}
            <div className="py-2 px-3 bg-white border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xs font-bold">Template Editor</h3>
              <div className="flex gap-1">
                <button className="p-1 rounded bg-gray-100">
                  <Layers className="h-3 w-3" />
                </button>
                <button className="p-1 rounded bg-gray-100">
                  <SquarePen className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex flex-1">
              {/* Left sidebar - components */}
              <div className="w-10 bg-white border-r border-gray-200 p-1 flex flex-col gap-1">
                <button className="p-1 rounded hover:bg-gray-100">
                  <PanelTop className="h-3 w-3" />
                </button>
                <button className="p-1 rounded bg-primary/10 text-primary">
                  <FileCode className="h-3 w-3" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Palette className="h-3 w-3" />
                </button>
              </div>
              
              {/* Main editor area */}
              <div className="flex-1 p-2 relative">
                {/* Preview of the template being edited */}
                <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-500 h-8 w-full"></div>
                  
                  <div className="p-2 space-y-2">
                    {/* Profile image */}
                    <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto"></div>
                    
                    {/* Username */}
                    <div className="h-2 bg-gray-300 w-16 rounded-full mx-auto"></div>
                    
                    {/* Button - currently selected */}
                    <div 
                      className={`p-1.5 rounded-md w-full bg-blue-500 ${selectedElement === 'button' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedElement('button')}
                    >
                      <div className="h-1 bg-white w-12 rounded-full mx-auto"></div>
                    </div>
                    
                    {/* Another button */}
                    <div 
                      className={`p-1.5 rounded-md w-full bg-gray-200 ${selectedElement === 'button2' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedElement('button2')}
                    >
                      <div className="h-1 bg-gray-400 w-10 rounded-full mx-auto"></div>
                    </div>
                  </div>
                </div>
                
                {/* Selection indicator */}
                {selectedElement === 'button' && (
                  <div className="absolute -right-3 top-12 bg-white shadow-md rounded px-1.5 py-0.5 text-[8px] font-medium">
                    Selected
                  </div>
                )}
              </div>
            </div>
            
            {/* Bottom panel - properties */}
            <div className="bg-white border-t border-gray-200 py-2 px-3">
              <div className="text-[8px] font-medium mb-1">Properties</div>
              <div className="flex gap-1 items-center">
                <div className="text-[8px]">Color</div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500 ring-1 ring-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <FileCode className="h-4 w-4 text-primary" />
      </div>
      <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center shadow-md">
        <Palette className="h-4 w-4 text-white" />
      </div>
    </div>
  );
};

export default CreateTemplateMockup;
