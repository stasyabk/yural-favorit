import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { scrollToSearchResults } from '../../utils/scroll.js';

export default function RouteScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(null);

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    const samePage = previousPath.current === location.pathname;
    previousPath.current = location.pathname;
    // Запись параметров submit не меняет позицию: прокруткой управляет HomePage после ответа.
    if (samePage && navigationType === 'REPLACE') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (location.pathname !== '/' || !location.state?.search?.submittedQuery) return;
    const frame = requestAnimationFrame(() => scrollToSearchResults('instant'));
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.pathname, location.state, navigationType]);

  return null;
}
