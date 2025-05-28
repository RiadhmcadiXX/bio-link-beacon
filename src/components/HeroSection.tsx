
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";

const HeroSection = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
  const yourRef = useRef<HTMLSpanElement>(null);
  const identityRef = useRef<HTMLSpanElement>(null);
  const oneRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLSpanElement>(null);

  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      yourRef.current?.classList.add('opacity-100', 'translate-y-0');
    }, 200);

    const timeout2 = setTimeout(() => {
      identityRef.current?.classList.add('opacity-100', 'translate-y-0');
    }, 400);

    const timeout3 = setTimeout(() => {
      oneRef.current?.classList.add('opacity-100', 'translate-y-0');
    }, 800);

    const timeout4 = setTimeout(() => {
      linkRef.current?.classList.add('opacity-100', 'translate-y-0');
    }, 1100);

    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    const timeoutB = setTimeout(() => {
      setShowButtons(true);
    }, 1600); // 200ms after the last word fades in
  

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(timeout);
      clearTimeout(timeoutB);
    };
  }, []);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Background decoration */}
      

      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-5">
          <span ref={yourRef} className="inline-block opacity-0 transform translate-y-8 transition-all duration-700 ease-out">Your </span>
          <span ref={identityRef} className="inline-block opacity-0 transform translate-y-8 transition-all duration-700 ease-out"> Identity. </span>
          <br className="md:hidden" />
          <span ref={oneRef} className="inline-block opacity-0 transform translate-y-8 transition-all duration-700 ease-out"> One </span>
          <span ref={linkRef} className="inline-block opacity-0 transform translate-y-8 transition-all duration-700 ease-out text-primary">Link.</span>
        </h1>

        <p className={`text-lg sm:text-xl md:text-2xl text-gray-600 mt-10 max-w-2xl mx-auto  transform transition-all duration-700 ease-out
          ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          Create a beautiful link-in-bio page that showcases all your content in one simple, elegant link.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 ease-out mt-8
          ${showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Button
            onClick={onGetStartedClick}
            className="btn btn-lg btn-primary px-8 py-6 text-lg rounded-full transition-all duration-300 
              hover:shadow-lg hover:shadow-primary/40 hover:scale-105"
          >
            Get Started
          </Button>

          <Button
            variant="outline"
            className="btn btn-lg px-8 py-6 text-lg rounded-full hover:bg-secondary/20 transition-all duration-300"
          >
            See Examples
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
