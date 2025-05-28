
import { FileText } from "lucide-react";
import { useState } from "react";

const LinkTypesMockup = () => {
  const [activeTab, setActiveTab] = useState('links');
  
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="rounded-[2rem] bg-gray-900 p-1.5 shadow-xl">
        <div className="rounded-[1.8rem] overflow-hidden aspect-[9/19] relative">
          <div className="absolute inset-0 bg-white text-gray-800 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b">
              <div 
                className={`flex-1 text-center py-2 text-xs ${activeTab === 'links' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                onClick={() => setActiveTab('links')}
              >
                Links
              </div>
              <div 
                className={`flex-1 text-center py-2 text-xs ${activeTab === 'products' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                onClick={() => setActiveTab('products')}
              >
                Products
              </div>
              <div 
                className={`flex-1 text-center py-2 text-xs ${activeTab === 'media' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                onClick={() => setActiveTab('media')}
              >
                Media
              </div>
            </div>
            
            {/* Content based on active tab */}
            <div className="p-3">
              {activeTab === 'links' && (
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-md p-2 text-xs">Standard Link</div>
                  <div className="bg-gray-100 rounded-md p-2 text-xs">Email Subscription</div>
                </div>
              )}
              
              {activeTab === 'products' && (
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-md p-2.5 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-md mr-2"></div>
                    <div>
                      <div className="text-xs font-bold">Product</div>
                      <div className="text-[10px] text-primary">$19.99</div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-md p-2.5 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-md mr-2"></div>
                    <div>
                      <div className="text-xs font-bold">Course</div>
                      <div className="text-[10px] text-primary">$49.99</div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'media' && (
                <div>
                  <div className="aspect-video bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-0 h-0 border-l-8 border-l-gray-800 border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 text-center">Embedded video content</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <FileText className="h-4 w-4 text-primary" />
      </div>
    </div>
  );
};

export default LinkTypesMockup;
