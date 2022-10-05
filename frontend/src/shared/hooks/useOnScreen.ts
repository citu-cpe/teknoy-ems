import { MutableRefObject, useState, useMemo, useEffect } from 'react';

export const useOnScreen = (ref: MutableRefObject<Element | null>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      ),
    []
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [observer, ref]);

  return isIntersecting;
};
