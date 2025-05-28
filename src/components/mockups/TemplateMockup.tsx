
import { LayoutTemplate } from "lucide-react";
import { useState } from "react";

const TemplateMockup = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const templates = [1, 2, 3];
  
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="rounded-[2rem] bg-gray-900 p-1.5 shadow-xl">
        <div className="rounded-[1.8rem] overflow-hidden aspect-[9/19] relative">
          <div className="absolute inset-0 bg-white text-gray-800 flex flex-col">
            <h3 className="text-sm font-bold text-center py-3">Choose a Template</h3>
            
            <div className="px-3 pb-3 flex-1 overflow-y-auto">
              {templates.map((template) => (
                <div 
                  key={template}
                  className={`mb-3 rounded-md overflow-hidden border-2 transition-all ${selectedTemplate === template ? 'border-primary shadow-md' : 'border-gray-200'}`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="aspect-[9/16] relative">
                    {/* Template preview */}
                    <div className={`absolute inset-0 ${
                      template === 1 ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                      template === 2 ? 'bg-gradient-to-br from-green-400 to-teal-500' :
                      'bg-gradient-to-br from-amber-400 to-orange-500'
                    }`}>
                      {/* Simplified template preview */}
                      <div className="flex flex-col items-center pt-2">
                        <div className="w-4 h-4 rounded-full bg-white/80 mb-1"></div>
                        <div className="h-1 w-8 bg-white/80 rounded-full mb-2"></div>
                        
                        <div className="w-full px-1.5 space-y-1">
                          <div className="h-1.5 bg-white/40 rounded-md"></div>
                          <div className="h-1.5 bg-white/40 rounded-md"></div>
                          <div className="h-1.5 bg-white/40 rounded-md"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected check */}
                    {selectedTemplate === template && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="py-1 px-2 text-[10px] text-center">
                    Template {template}
                  </div>
                </div>
              ))}
              
              <div className="mb-3 rounded-md overflow-hidden border-2 border-dashed border-gray-300 py-4 flex flex-col items-center justify-center">
                <div className="text-xs text-gray-400">Coming soon</div>
                <div className="text-[10px] text-gray-400">More templates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <LayoutTemplate className="h-4 w-4 text-primary" />
      </div>
      
      {/* Theme color dots */}
      <div className="absolute -bottom-2 -right-1 flex gap-1">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
    </div>
  );
};

export default TemplateMockup;
