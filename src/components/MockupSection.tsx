
import { useState } from 'react';

const MockupSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="relative w-full max-w-[320px] overflow-visible bg-white/90 backdrop-blur">
      
      <div className="container mx-auto ">
        <div 
          className={`relative mx-auto  transition-all duration-700 ease-out transform ${
            isHovered ? 'scale-[1.02]' : 'scale-100'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Phone frame */}
          <div className="rounded-[2.5rem] bg-gray-900 p-2 shadow-2xl">
            {/* Phone screen */}
            <div className="rounded-[2rem] overflow-hidden  aspect-[9/19] relative">
              {/* Screen content */}
              <div className="absolute inset-0 bg-brand-blue">
                {/* Profile section */}
                <div className="flex flex-col items-center pt-12 pb-8 bg-brand-blue text-white">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mb-4">
                    <img 
                      src="/lovable-uploads/36920451-5ba9-411c-8050-eda472e3ffad.png" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Jerry J.</h3>
                  <p className="text-sm opacity-90">Left Fullback</p>
                </div>
                
                {/* Links section */}
                <div className="px-6 py-4">
                  <div className="bg-white/20 rounded-md p-4 mb-3 backdrop-blur-sm"></div>
                  <div className="bg-white/20 rounded-md p-4 mb-3 backdrop-blur-sm"></div>
                  <div className="bg-white/20 rounded-md p-4 mb-3 backdrop-blur-sm"></div>
                </div>
                
                {/* Bottom buttons */}
                {/* <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between">
                  <div className="bg-brand-pink rounded-lg w-16 h-12 flex items-center justify-center">
                    <div className="flex flex-col gap-1">
                      <div className="h-1 w-8 bg-brand-blue rounded-full"></div>
                      <div className="h-1 w-8 bg-brand-blue rounded-full"></div>
                      <div className="h-1 w-8 bg-brand-blue rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="bg-[#FFD700] rounded-lg w-12 h-12 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full w-full">
                        <div className="flex flex-col gap-1 p-2">
                          <div className="h-1 w-8 bg-brand-blue rounded-full"></div>
                          <div className="h-1 w-5 bg-brand-blue rounded-full"></div>
                          <div className="h-1 w-7 bg-brand-blue rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-brand-cyan rounded-lg w-12 h-12 flex items-center justify-center">
                      <div className="flex flex-col gap-1">
                        <div className="h-1 w-8 bg-white rounded-full"></div>
                        <div className="h-1 w-8 bg-white rounded-full"></div>
                        <div className="h-1 w-8 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          
          {/* Floating design elements */}
          <div className="absolute -top-10 -left-20 w-40 h-40 bg-brand-lime opacity-80 rounded-full blur-2xl animate-pulse-light"></div>
          <div className="absolute -right-10 top-1/2 w-16 h-16 bg-brand-cyan rounded-full animate-float"></div>
          <div className="absolute -left-4 bottom-1/3 w-10 h-10 bg-brand-pink rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          
          {/* Font card elements */}
          <div className="absolute -left-24 top-1/4 flex gap-2">
            <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-xl font-sans">Aa</span>
            </div>
            <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-xl font-serif">Aa</span>
            </div>
            <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-xl font-mono">Aa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MockupSection;
