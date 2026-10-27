import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { scrollToSearchResults } from '../../utils/scroll.js';

export default function RouteScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const submittedQuery = useSelector((state) => state.search.submittedQuery);
  const previousKey = useRef(null);

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    const sameEntry = previousKey.current === location.key;
    previousKey.current = location.key;
    // Изменение параметров поиска не является переходом: HomePage прокрутит после ответа.
    if (sameEntry) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (navigationType !== 'POP' && location.state?.scrollToTop) return;
    if (location.pathname !== '/' || !submittedQuery) return;
    const frame = requestAnimationFrame(() => scrollToSearchResults('instant'));
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.pathname, location.state, navigationType, submittedQuery]);

  return null;
}
