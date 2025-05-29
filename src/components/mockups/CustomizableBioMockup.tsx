
import { useState } from 'react';
import { Palette } from "lucide-react";
import RotatingAvatar from './RotatingAvatar';

const CustomizableBioMockup = () => {
  const [selectedTheme, setSelectedTheme] = useState('blue');

  const themes = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-pink-500 to-purple-600",
    green: "from-green-400 to-emerald-500",
  };

  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="rounded-[2rem] bg-gray-900 p-1.5 shadow-xl">
        <div className="rounded-[1.8rem] overflow-hidden aspect-[9/19] relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${themes[selectedTheme]} text-white`}>
            {/* Profile content */}
            <div className="flex flex-col items-center pt-8 pb-3">
              <RotatingAvatar />
              <h3 className="text-sm font-bold mb-1">@username</h3>
              <p className="text-xs opacity-90 mb-3">Bio description</p>
            </div>

            <div className="flex flex-col items-center pt-2">


              <div className="w-full px-4 space-y-3">
                <div className="h-5  bg-white/40 rounded-md"></div>
                <div className="h-5  bg-white/40 rounded-md"></div>
                <div className="h-5  bg-white/40 rounded-md"></div>

              </div>
            </div>

            {/* Theme selector */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 cursor-pointer ${selectedTheme === 'blue' ? 'ring-2 ring-white' : ''}`}
                onClick={() => setSelectedTheme('blue')}
              />
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 cursor-pointer ${selectedTheme === 'purple' ? 'ring-2 ring-white' : ''}`}
                onClick={() => setSelectedTheme('purple')}
              />
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 cursor-pointer ${selectedTheme === 'green' ? 'ring-2 ring-white' : ''}`}
                onClick={() => setSelectedTheme('green')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <Palette className="h-4 w-4 text-primary" />
      </div>
      <div className="absolute bottom- 32 left-1/2 transform -translate-x-1/2 flex gap-4 z-50 mt-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xs font-bold text-white">Links</span>
        </div>
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xs font-bold text-white">Products</span>
        </div>
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xs font-bold text-white">Videos</span>
        </div>
      </div>

    </div>
  );
};

export default CustomizableBioMockup;
