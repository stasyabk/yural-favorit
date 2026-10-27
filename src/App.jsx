import { useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import RouteScrollManager from './components/RouteScrollManager/RouteScrollManager.jsx';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHomePage = useMatch('/') !== null;

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Перейти к содержимому</a>
      <Header
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen((isOpen) => !isOpen)}
        onMenuClose={() => setIsMenuOpen(false)}
      />
      <main id="main-content" className={isHomePage ? 'page-content page-content--home' : 'container page-content'} tabIndex={-1}>
        <Outlet />
      </main>
      <RouteScrollManager />
    </div>
  );
}
