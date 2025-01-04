import { useContext } from "react";
import { AlbumContext, AlbumContextType } from './AlbumContext'

// Hook for using AlbumContext
export const useAlbumContext = (): AlbumContextType => {
    const context = useContext(AlbumContext);
    if (!context) {
      throw new Error("useAlbumContext must be used within an AlbumProvider");
    }
    return context;
  };