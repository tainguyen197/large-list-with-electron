import { useEffect, useRef } from 'react';

const options = {
  root: null, // Use the viewport as the root
  rootMargin: '0px',
  threshold: 0.5,
};

export const useObserver = ({ identity, onObserver }: any) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, options);

    // Start observing the target element
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  const handleIntersection = (entries: any) => {
    entries.forEach((entry: any) => {
      onObserver && onObserver(entry.isIntersecting);
    });
  };

  return observerRef;
};
