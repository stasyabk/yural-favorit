import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="container py-5">
        <Outlet />
      </main>
    </>
  );
}
