import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header.jsx';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`app-shell${isMenuOpen ? ' app-shell--menu-open' : ''}`}>
      <a href="#main-content" className="skip-link">Перейти к содержимому</a>
      <Header
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen((isOpen) => !isOpen)}
        onMenuClose={() => setIsMenuOpen(false)}
      />
      <main id="main-content" className="container page-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
