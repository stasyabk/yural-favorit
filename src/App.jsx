import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactsPage from './pages/ContactsPage.jsx';
import PartDetailsPage from './pages/PartDetailsPage.jsx';

export default function App() {
  return (
    <main className="container py-5">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/parts/:brand/:number" element={<PartDetailsPage />} />
      </Routes>
    </main>
  );
}
