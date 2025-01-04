import { useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import Searchbar from "./Searchbar";
import { useAuth } from "../contexts/AuthContext/useAuth";

interface Album {
    mbid: string,
    title: string,
    artist: string
}

function Profile() {

    const { isAuthenticated, username, email, logout} = useAuth();

    const [usersAlbums, setUsersAlbums] = useState<Album[] | null>(null);
    const [savedAlbums, setSavedAlbums] = useState<Album[] | null>(null);

    console.log("USER:", isAuthenticated, username, email )

    useEffect(() => {
        // Fetch all albums in usersAlbums
        const getUsersAlbums = async () => {
            try {
                const response = await fetch('http://localhost:5000/user-albums', {
                    credentials: 'include'
                });
                const data: { usersAlbums: Album[], savedAlbums: Album[] } = await response.json();
                console.log("DATA:",data)
                console.log("User albums",data.usersAlbums)
                setUsersAlbums(data.usersAlbums);
                setSavedAlbums(data.savedAlbums);
            } catch (error) {
                console.log(error)
            }
        }

        // Only fetch is user is logged in
        if(isAuthenticated) {
            getUsersAlbums();
        }
    }, [isAuthenticated])

    const handleLogin = async () => {
        try {
            const returnUrl = window.location.pathname || '/';
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
                            <p 
                                // Ensure key is unique
                                key={`${album.mbid}-${index}`}>
                                    <b>{album.title}</b> - {album.artist}
                            </p>
                            )) 
                        ) : ( 
                            <p>No albums yet</p> 
                            )}
                    </div>
                    <div>
                        {/* Condionally render users albums */}
                        Saved albums: {savedAlbums ? ( 
                            savedAlbums.map((album, index) => (
                            <p 
                                // Ensure key is unique
                                key={`${album.mbid}-${index}`}>
                                    <b>{album.title}</b> - {album.artist}
                            </p>
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