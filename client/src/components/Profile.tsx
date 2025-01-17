// import { useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import Searchbar from "./Searchbar";
import { useAuth } from "../contexts/AuthContext/useAuth";
import { useAlbumContext } from "../contexts/AlbumContext/useAlbumContext";

function Profile() {
    const { isAuthenticated, username, email, logout} = useAuth();
    const { usersAlbums, setUsersAlbums, savedAlbums, setSavedAlbums} = useAlbumContext();

    console.log("USER:", isAuthenticated, username, email )

    const handleLogin = async () => {
        try {
            const returnUrl = window.location.pathname;
            window.location.replace(`http://localhost:5000/login?returnUrl=${returnUrl}`);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    // Calls logout function from AuthContext
    const handleLogout = () => {
        if(logout) {
            // Confirmation message before logout
            if(window.confirm('Are you sure you want to log out?')) {
                logout();
            }
        }
    };

    // Delete album from users list
    const removeAlbum = async (albumId:string, rating: number | null) => {
        try {    
        const response = await fetch('http://localhost:5000/remove-album', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({albumId, rating})
            });

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        // Update albums in state after deletion
        if(rating === 0){
            setSavedAlbums((prev) => prev?.filter((album) => album.id !== albumId) || null);
        } else {
            setUsersAlbums((prev) => prev?.filter((album) => album.id !== albumId) || null);
        }

        } catch (error) {
        console.error("Error removing album:",error)
        }
    }

    return(
      <>

    <div className="flex fixed top-0 left-0 ml-3 mt-3">

    <Navbar />
    </div>

    <Searchbar/>

        <div>
            <h1>Your Profile</h1>
            {isAuthenticated ? (
                <div>
                    <h2>Welcome, {username}</h2>
                    <p>Your email: {email}</p>
                    <div>
                        {/* Condionally render users albums */}
                        Your albums: {usersAlbums ? ( 
                            usersAlbums.map((album, index) => (
                            <div 
                                // Ensure key is unique
                                key={`${index}`}>
                                    <b>{album.title}</b> - {album.artist}
                                    <button onClick={() => removeAlbum(album.id, album.rating!)}>Remove</button>
                            </div>
                            )) 
                        ) : ( 
                            <p>No albums yet</p> 
                            )}
                    </div>
                    <div>
                        {/* Condionally render users albums */}
                        Saved albums: {savedAlbums ? ( 
                            savedAlbums.map((album, index) => (
                            <div
                                // Ensure key is unique
                                key={`${index}`}>
                                    <b>{album.title}</b> - {album.artist}
                                    <button onClick={() => removeAlbum(album.id, 0)}>Remove</button>
                            </div>
                            )) 
                        ) : ( 
                            <p>No albums saved yet</p> 
                            )}
                    </div>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>Please log in to continue</p>
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}
        </div>
      </>
    )
}

export default Profile