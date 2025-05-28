import { useState } from 'react';
import SpotifyPlayer from './SpotifyPlayer';
import YouTubeEmbed from './YoutubeEmbed';

interface MockupSectionProps {
  gradient?: string; // e.g., "from-pink-500 to-purple-600"
}

const MockupSection = ({ gradient = "from-pink-500 to-purple-600" }: MockupSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full max-w-[320px] overflow-visible bg-white/90 backdrop-blur">
      <div className="container mx-auto">
        <div
          className={`relative mx-auto transition-all duration-700 ease-out transform ${isHovered ? 'scale-[1.02]' : 'scale-100'
            }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Phone frame */}
          <div className="rounded-[2.5rem] bg-gray-900 p-2 shadow-2xl">
            {/* Phone screen */}
            <div className="rounded-[2rem] overflow-hidden aspect-[9/19] relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} text-white`}>
                {/* Combined Profile + Screen content */}
                <div className="flex flex-col items-center pt-12 pb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mb-4">
                    <img
                      src="/lovable-uploads/36920451-5ba9-411c-8050-eda472e3ffad.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Riadh.</h3>
                  <p className="text-sm opacity-90 mb-6">Left Fullback</p>

                  {/* Link buttons */}
                  <div className="w-full px-6 space-y-3">
                    <div className="bg-white/20 rounded-md p-4 backdrop-blur-sm"></div>
                    <div className="bg-white/20 rounded-md p-4 backdrop-blur-sm"></div>
                    <div className="bg-white/20 rounded-md p-4 backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating design elements */}
          <div className="absolute -top-10 -left-20 w-40 h-40 bg-brand-lime opacity-80 rounded-full blur-2xl animate-pulse-light"></div>
          <div className="absolute -right-10 top-1/2 w-16 h-16 bg-brand-cyan rounded-full animate-float"></div>
          <div className="absolute -left-4 bottom-1/3 w-10 h-10 bg-brand-pink rounded-full animate-float" style={{ animationDelay: '1s' }}></div>

          {/* Font card elements */}
          <div className="absolute -left-32 top-1/4 flex gap-2">
            <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-xl font-lobster">Aa</span>
            </div>
            <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-xl font-serif">Aa</span>
            </div>
            <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-xl font-mono">Aa</span>
            </div>
          </div>

          {/* Youtube Embed */}
          <div className="absolute -left-32 top-2/3 flex items-center gap-4  p-3 w-90">
            <div className="aspect-w-16 aspect-h-9 w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <YouTubeEmbed videoId="xnOwOBYaA3w" title="Rick Astley - Never Gonna Give You Up" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MockupSection;
