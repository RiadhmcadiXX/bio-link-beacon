
import { useEffect, useRef, useState } from 'react';

interface UseIsVisibleOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIsVisible = <T extends HTMLElement>(
  options: UseIsVisibleOptions = {}
): [React.RefObject<T>, boolean] => {
  const { threshold = 0.2, rootMargin = '0px', triggerOnce = false } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
};
