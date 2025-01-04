import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";

interface Album {
  title: string;
  artist: string;
  rating?: number | null;
}

interface AlbumContextType {
  usersAlbums: Album[] | null;
  savedAlbums: Album[] | null;
}

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

export const AlbumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)!;

  const [usersAlbums, setUsersAlbums] = useState<Album[] | null>(null);
  const [savedAlbums, setSavedAlbums] = useState<Album[] | null>(null);

  useEffect(() => {
    // Fetch all albums in usersAlbums
    const getUsersAlbums = async () => {
      try {
        const response = await fetch('http://localhost:5000/user-albums', {
          credentials: 'include',
        });
        const data: { usersAlbums: Album[]; savedAlbums: Album[] } = await response.json();
        console.log("DATA:", data);
        setUsersAlbums(data.usersAlbums);
        setSavedAlbums(data.savedAlbums);
      } catch (error) {
        console.error("Error fetching user albums:", error);
      }
    };

    // Only fetch if the user is logged in
    if (isAuthenticated) {
      getUsersAlbums();
    }
  }, [isAuthenticated]);

  return (
    <AlbumContext.Provider value={{ usersAlbums, savedAlbums }}>
      {children}
    </AlbumContext.Provider>
  );
};

export {AlbumContext}
export type {AlbumContextType}
