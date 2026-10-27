import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import HomePage from '../pages/HomePage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ContactsPage from '../pages/ContactsPage.jsx';
import PartDetailsPage from '../pages/PartDetailsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: 'about', Component: AboutPage },
      { path: 'contacts', Component: ContactsPage },
      { path: 'parts/:brand/:number', Component: PartDetailsPage },
    ],
  },
]);
