import { useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ isMenuOpen, onMenuToggle, onMenuClose }) {
  const toggleRef = useRef(null);

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isMenuOpen) {
      onMenuClose();
      toggleRef.current?.focus();
    }
  }

  return (
    <header className="site-header fixed-top" onKeyDown={handleKeyDown}>
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="YURAL FAVORIT — на главную" onClick={onMenuClose}>
          <span>YURAL</span> <span className="brand-accent">FAVORIT</span>
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle btn d-md-none"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={onMenuToggle}
        >
          <span className="menu-toggle-icon" aria-hidden="true"><span /><span /><span /></span>
          <span>Меню</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Основная навигация"
          className={`site-nav${isMenuOpen ? ' site-nav--open' : ''}`}
        >
          <NavLink to="/" end className="nav-link" onClick={onMenuClose}>Главная</NavLink>
          <NavLink to="/about" className="nav-link" onClick={onMenuClose}>О нас</NavLink>
          <NavLink to="/contacts" className="nav-link" onClick={onMenuClose}>Контакты</NavLink>
        </nav>
      </div>
    </header>
  );
}
