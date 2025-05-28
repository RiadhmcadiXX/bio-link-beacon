
import { useEffect, useState } from 'react';
import { Link } from "lucide-react";
import LinkManagerMockup from '../mockups/LinkManagerMockup';
import { useIsVisible } from '@/hooks/useIsVisible';

const LinkManagerSection = () => {
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`flex flex-col lg:flex-row-reverse items-center gap-12 transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <Link className="h-6 w-6 text-white" />
              </div>
              <span className="text-blue-600 font-semibold">Management</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Intuitive Link Manager
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Easily add, edit, and reorder your links with our intuitive drag-and-drop interface. No technical skills required.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-blue-600 shadow-sm">Drag & Drop</div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-blue-600 shadow-sm">Easy Editing</div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-blue-600 shadow-sm">Quick Reorder</div>
            </div>
          </div>

          {/* Mockup */}
          <div className={`w-full lg:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${
            showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <LinkManagerMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinkManagerSection;
