
import { useEffect, useState } from 'react';
import { FileText } from "lucide-react";
import LinkTypesMockup from '../mockups/LinkTypesMockup';
import { useIsVisible } from '@/hooks/useIsVisible';

const LinkTypesSection = () => {
  const [sectionRef, isVisible] = useIsVisible<HTMLDivElement>({ threshold: 0.3 });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`flex flex-col lg:flex-row items-center gap-12 transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-indigo-600 font-semibold">Content Types</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Multiple Link Types
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Showcase products, videos, social media profiles, and even accept donations all in one place. Endless possibilities.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-indigo-600 shadow-sm">Products</div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-indigo-600 shadow-sm">Videos</div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-indigo-600 shadow-sm">Donations</div>
            </div>
          </div>

          {/* Mockup */}
          <div className={`w-full lg:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${
            showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <LinkTypesMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinkTypesSection;
