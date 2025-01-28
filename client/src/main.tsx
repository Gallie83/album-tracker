import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import AlbumInfo from './components/AlbumInfo/AlbumInfo.tsx';
import Groups from './components/Groups.tsx';
import ArtistInfo from './components/ArtistInfo.tsx';
import SearchPage from './components/SearchPage.tsx';
import Profile from './components/Profile.tsx'
import { AuthProvider } from './contexts/AuthContext/AuthContext.tsx';
import { AlbumProvider } from './contexts/AlbumContext/AlbumContext.tsx';
import { GroupProvider } from './contexts/GroupContext/GroupContext.tsx';

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
 