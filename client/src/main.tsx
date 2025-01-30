import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx';
import AlbumInfo from './pages/AlbumInfo/AlbumInfo.tsx';
import Groups from './pages/Groups.tsx';
import ArtistInfo from './pages/ArtistInfo.tsx';
import SearchPage from './pages/SearchPage.tsx';
import Profile from './pages/Profile.tsx'
import { AuthProvider } from './contexts/AuthContext/AuthContext.tsx';
import { AlbumProvider } from './contexts/AlbumContext/AlbumContext.tsx';
import { GroupProvider } from './contexts/GroupContext/GroupContext.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: '/search/:searchQuery',
        element: <SearchPage />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/album-info/:artistName/:albumName',
        element: <AlbumInfo />
      },
      {
        path: '/artist-info/:artistName',
        element: <ArtistInfo />
      },  
      {
        path: '/groups',
        element: <Groups />
      }, 
    ]
  } 
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AlbumProvider>
        <GroupProvider>
          <RouterProvider router={router} />
        </GroupProvider>
      </AlbumProvider>
    </AuthProvider>
  </StrictMode>,
)
 