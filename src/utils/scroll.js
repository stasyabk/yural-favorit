export function scrollToSearchResults(behavior = 'smooth') {
  const hero = document.querySelector('.search-hero');
  const results = document.querySelector('.search-results');
  if (!hero || !results) return;
  const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
  const top = window.scrollY + hero.getBoundingClientRect().bottom - headerHeight + 10;
  window.scrollTo({ top: Math.max(0, top), behavior });
}
