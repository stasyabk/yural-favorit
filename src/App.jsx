import { useRef, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import RouteScrollManager from './components/RouteScrollManager/RouteScrollManager.jsx';
import { useLazyGetPartsByNumberQuery } from './services/favoritApi.js';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Подписка активного поиска живёт вместе с layout, включая просмотр деталей и аналогов.
  const [triggerSearch, searchResult] = useLazyGetPartsByNumberQuery();
  const searchRequest = useRef(null);
  const isHomePage = useMatch('/') !== null;

  function searchParts(number) {
    searchRequest.current = triggerSearch(number);
  }

  function cancelSearch() {
    searchRequest.current?.abort();
    // Снимаем подписку, сохраняя кеш до обычного срока удаления RTK Query.
    searchRequest.current?.unsubscribe();
    searchRequest.current = null;
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Перейти к содержимому</a>
      <Header
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen((isOpen) => !isOpen)}
        onMenuClose={() => setIsMenuOpen(false)}
      />
      <main id="main-content" className={isHomePage ? 'page-content page-content--home' : 'container page-content'} tabIndex={-1}>
        <Outlet context={{ searchParts, searchResult, cancelSearch }} />
      </main>
      <RouteScrollManager />
    </div>
  );
}
