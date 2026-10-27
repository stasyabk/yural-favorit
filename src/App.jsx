import { useState } from 'react';
import { Outlet, ScrollRestoration, useMatch } from 'react-router-dom';
import Header from './components/Header/Header.jsx';

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
      <ScrollRestoration />
    </div>
  );
}
