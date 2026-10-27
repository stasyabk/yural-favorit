import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-bottom">
      <div className="container d-flex flex-wrap align-items-center gap-3 py-3">
        <Link to="/" className="fw-bold text-dark text-decoration-none">YURAL FAVORIT</Link>
        <nav aria-label="Основная навигация" className="nav">
          <NavLink to="/" end className="nav-link">Главная</NavLink>
          <NavLink to="/about" className="nav-link">О нас</NavLink>
          <NavLink to="/contacts" className="nav-link">Контакты</NavLink>
        </nav>
      </div>
    </header>
  );
}
