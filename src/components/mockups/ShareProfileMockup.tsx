
import { useState } from 'react';
import { Share, QrCode, Copy, Check, Link } from "lucide-react";

const ShareProfileMockup = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="rounded-[2rem] bg-gray-900 p-1.5 shadow-xl">
        <div className="rounded-[1.8rem] overflow-hidden aspect-[9/19] relative">
          <div className="absolute inset-0 bg-white text-gray-800 flex flex-col">
            {/* Header */}
            <div className="py-3 px-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-bold">Share Profile</h3>
              <Share className="h-4 w-4 text-primary" />
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button 
                className={`flex-1 py-2 text-xs font-medium ${activeTab === 'link' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('link')}
              >
                Share Link
              </button>
              <button 
                className={`flex-1 py-2 text-xs font-medium ${activeTab === 'qr' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('qr')}
              >
                QR Code
              </button>
            </div>
            
            {/* Content */}
            <div className="p-3 flex-1">
              {activeTab === 'link' ? (
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500">Share your profile link with anyone</p>
                  
                  <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1.5">
                    <Link className="h-3 w-3 text-gray-500" />
                    <div className="text-[9px] font-medium flex-1 truncate">onelink.site/username</div>
                    <button 
                      className="bg-white rounded p-1 shadow-sm"
                      onClick={handleCopy}
                    >
                      {copied ? 
                        <Check className="h-3 w-3 text-green-500" /> : 
                        <Copy className="h-3 w-3 text-primary" />
                      }
                    </button>
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium">Share to</p>
                    <div className="grid grid-cols-4 gap-1">
                      {['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-purple-500'].map((bg, i) => (
                        <div key={i} className={`${bg} rounded-md p-1 flex items-center justify-center`}>
                          <Share className="h-3 w-3 text-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-3">
                  <div className="w-28 h-28 border-4 border-primary rounded-lg flex items-center justify-center bg-white">
                    <QrCode className="w-20 h-20 text-gray-800" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium">onelink.site/username</p>
                    <p className="text-[8px] text-gray-500">Scan to view profile</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <Share className="h-4 w-4 text-primary" />
      </div>
      <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-brand-lime rounded-full flex items-center justify-center shadow-md">
        <QrCode className="h-4 w-4 text-gray-800" />
      </div>
    </div>
  );
};

export default ShareProfileMockup;
