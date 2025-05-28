
import { useEffect, useState } from 'react';
import {
  Palette,
  Link,
  Activity,
  FileText,
  Eye,
  LayoutTemplate,
  Share,
  FileCode
} from "lucide-react";
import CustomizableBioMockup from './mockups/CustomizableBioMockup';
import LinkManagerMockup from './mockups/LinkManagerMockup';
import AnalyticsMockup from './mockups/AnalyticsMockup';
import LinkTypesMockup from './mockups/LinkTypesMockup';
import PreviewMockup from './mockups/PreviewMockup';
import TemplateMockup from './mockups/TemplateMockup';
import ShareProfileMockup from './mockups/ShareProfileMockup';
import CreateTemplateMockup from './mockups/CreateTemplateMockup';

const features = [
  {
    id: 1,
    icon: <Palette className="h-6 w-6" />,
    title: "Customizable Bio Page",
    description: "Personalize your profile with custom colors, themes, and layouts that match your brand identity.",
    mockup: <CustomizableBioMockup />
  },
  {
    id: 2,
    icon: <Link className="h-6 w-6" />,
    title: "Link Manager",
    description: "Easily add, edit, and reorder your links with our intuitive drag-and-drop interface.",
    mockup: <LinkManagerMockup />
  },
  {
    id: 3,
    icon: <Share className="h-6 w-6" />,
    title: "Share Your Profile",
    description: "Easily share your profile via link or QR code with your audience across different platforms.",
    mockup: <ShareProfileMockup />
  },
  {
    id: 4,
    icon: <Activity className="h-6 w-6" />,
    title: "Real-time Analytics",
    description: "Track clicks, views, and engagement to understand your audience and optimize your content.",
    mockup: <AnalyticsMockup />
  },
  {
    id: 5,
    icon: <FileText className="h-6 w-6" />,
    title: "Multiple Link Types",
    description: "Showcase products, videos, social media profiles, and even accept donations all in one place.",
    mockup: <LinkTypesMockup />
  },
  {
    id: 6,
    icon: <Eye className="h-6 w-6" />,
    title: "Public Profile Preview",
    description: "See exactly how your audience will view your page with our live preview feature.",
    mockup: <PreviewMockup />
  },
  {
    id: 7,
    icon: <LayoutTemplate className="h-6 w-6" />,
    title: "Template Picker",
    description: "Choose from a variety of stylish templates with beautiful animations to make your page stand out.",
    mockup: <TemplateMockup />
  },
  {
    id: 8,
    icon: <FileCode className="h-6 w-6" />,
    title: "Create Your Own Templates",
    description: "Pro users can design and create custom templates to perfectly match their brand identity.",
    mockup: <CreateTemplateMockup />,
    proBadge: true
  }
];

const FeatureCard = ({ feature, index, isVisible }: { feature: typeof features[0], index: number, isVisible: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`transition-all duration-700 ease-out relative
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        card-shadow hover:shadow-lg p-5`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {feature.proBadge && (
        <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          Pro
        </div>
      )}
      <div className={`mb-3 text-primary transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
        {feature.icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
      <p className="text-gray-600 text-sm">{feature.description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const [visible, setVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(features.map(() => false));

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 150);
    
    // Staggered animation for features
    features.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newItems = [...prev];
          newItems[index] = true;
          return newItems;
        });
      }, 300 + index * 150);
    });
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="features" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className={`text-center mb-12 transition-all duration-700 ease-in-out 
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            One Profile. Endless Possibilities.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create a stunning link-in-bio page that stands out.
          </p>
        </div>

        <div className="space-y-20 md:space-y-32">
          {features.map((feature, index) => (
            <div key={feature.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 md:gap-12`}>
              {/* Feature description */}
              <div className={`w-full lg:w-1/2  bg-white
                 ${visibleItems[index] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} 
                 transition-all duration-700 delay-300`}>
                <FeatureCard feature={feature} index={index} isVisible={visibleItems[index]} />
                
              </div>

              
              
              {/* Feature mockup */}
              <div className={`w-full lg:w-1/2 flex justify-center items-center
                ${visibleItems[index] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} 
                transition-all duration-700 delay-500`}>
                {feature.mockup}
                
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
