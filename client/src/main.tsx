import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Start from './pages/Start.tsx';
import Elio from './pages/Elio.tsx';
import './App.css';

const router = createBrowserRouter([
  { path: '/', element: <Start /> },
  { path: '/elio', element: <Elio /> }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
