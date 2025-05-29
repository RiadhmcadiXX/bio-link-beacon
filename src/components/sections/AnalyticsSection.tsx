
import { useEffect, useState } from 'react';
import { Activity } from "lucide-react";
import AnalyticsMockup from '../mockups/AnalyticsMockup';
import { useIsVisible } from '@/hooks/useIsVisible';

const AnalyticsSection = () => {
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
      className="min-h-screen bg-gradient-to-br from-orange-50 to-red-400 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-red-200/30 blur-3xl" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`flex flex-col lg:flex-row-reverse items-center gap-12 transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-orange-600 font-semibold">Analytics</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Real-time Analytics
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Track clicks, views, and engagement to understand your audience and optimize your content for maximum impact.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-orange-600 shadow-sm">Click Tracking</div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-orange-600 shadow-sm">View Analytics</div>
              <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-orange-600 shadow-sm">Engagement Metrics</div>
            </div>
          </div>

          {/* Mockup */}
          <div className={`w-full lg:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${
            showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <AnalyticsMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
