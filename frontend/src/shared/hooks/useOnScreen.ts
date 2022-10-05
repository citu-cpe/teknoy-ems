import { MutableRefObject, useState, useMemo, useEffect } from 'react';

export const useOnScreen = (ref: MutableRefObject<Element | null>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};
