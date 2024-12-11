import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import AlbumInfo from './components/AlbumInfo.tsx';
import ArtistInfo from './components/ArtistInfo.tsx';
import SearchPage from './components/SearchPage.tsx';
import Register from './components/Register.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/search/:searchQuery',
    element: <SearchPage />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/album-info/:artistName/:albumName',
    element: <AlbumInfo />
  },
  {
    path: '/artist-info/:artistName',
    element: <ArtistInfo />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
 