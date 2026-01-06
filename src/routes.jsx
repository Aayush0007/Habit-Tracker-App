import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import StudySessions from './pages/StudySessions/StudySessions.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/study-sessions',
    element: <StudySessions />,
  },
]);