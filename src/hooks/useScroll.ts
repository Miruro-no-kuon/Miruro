import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const location = useLocation();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem(location.pathname);
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    };

    const saveScrollPosition = () =>
      sessionStorage.setItem(location.pathname, window.scrollY.toString());

    window.addEventListener('beforeunload', saveScrollPosition);
    window.addEventListener('popstate', restoreScrollPosition);

    const ignoreRoutePattern = /^\/watch\/[^/]+\/[^/]+\/[^/]+$/;
    if (
      prevPathnameRef.current !== location.pathname &&
      !ignoreRoutePattern.test(location.pathname)
    ) {
      if (location.state?.preserveScroll) {
        restoreScrollPosition();
      } else {
        window.scrollTo(0, 0);
      }
    }

    prevPathnameRef.current = location.pathname;

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
      window.removeEventListener('popstate', restoreScrollPosition);
    };
  }, [location]);

  return null;
}

export const usePreserveScrollOnReload = () => {
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
