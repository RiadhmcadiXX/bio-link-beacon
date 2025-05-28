
import { useEffect, useState } from 'react';
import { Eye } from "lucide-react";
import PreviewMockup from '../mockups/PreviewMockup';
import { useIsVisible } from '@/hooks/useIsVisible';

const PreviewSection = () => {
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
      className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`flex flex-col lg:flex-row-reverse items-center gap-12 transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-4">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <span className="text-teal-600 font-semibold">Preview</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Live Preview
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              See exactly how your audience will view your page with our live preview feature. Perfect your design before going live.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-teal-600 shadow-sm">Real-time Preview</div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-teal-600 shadow-sm">Mobile Responsive</div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-teal-600 shadow-sm">Design Perfect</div>
            </div>
          </div>

          {/* Mockup */}
          <div className={`w-full lg:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${
            showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <PreviewMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
