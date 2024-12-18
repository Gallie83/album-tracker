import { useState, useEffect } from "react";
import Navbar from "./Navbar/Navbar"
import Searchbar from "./Searchbar"

function Register() {

    interface UserInfo {
        username?: string;
        email?: string;
        attributes?: Record<string, string>;
    }

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    // Check if user is logged in 
    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:5000/', {
                method: 'GET',
                credentials: 'include', // Ensure cookies are sent
            });
            if (response.ok) {
                const data = await response.json();
                console.log("data:", data)
                setIsAuthenticated(data.isAuthenticated);
                setUserInfo(data.userInfo);
                console.log("UserInfo:", userInfo)
            } else {
                console.error('Failed to fetch authentication status');
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
        }
    };

    useEffect(() => {
        checkAuth(); // Check authentication on component mount
    }, []);

    const handleLogin = async () => {
        try {
            const returnUrl = window.location.pathname || '/';
            window.location.replace(`http://localhost:5000/login?returnUrl=${returnUrl}`);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'GET',
            });
            if (response.ok) {
                setIsAuthenticated(false);
                setUserInfo(null);
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return(
      <>

    <div className="flex fixed top-0 left-0 ml-3 mt-3">

    <Navbar />
    </div>

    <Searchbar/>

        <div>
            <h1>Amazon Cognito User Pool Demo</h1>
            {isAuthenticated ? (
                <div>
                    <h2>Welcome, {userInfo?.username || userInfo?.email}</h2>
                    <p>Here are some attributes you can use as a developer:</p>
                    <pre>{JSON.stringify(userInfo, null, 4)}</pre>
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

export default Register