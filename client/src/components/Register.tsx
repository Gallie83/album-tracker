import { useState } from "react";
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

    const handleLogin = async () => {
        try {
            window.location.href = '/login';
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