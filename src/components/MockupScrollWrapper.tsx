import { useEffect, useState } from "react";
import MockupSection from "./MockupSection";

const MockupScrollWrapper = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      // Adjust this value based on height of HeroSection
      setIsSticky(scrollY > 200);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative z-20">
      <div
        className={`transition-all duration-700 ease-out
          ${isSticky ? "fixed top-0 left-0 w-full bg-white shadow-lg z-30" : "relative"}
        `}
      >
        <MockupSection />
      </div>
    </div>
  );
};

export default MockupScrollWrapper;
