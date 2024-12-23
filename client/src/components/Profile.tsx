import { useContext } from "react";
import Navbar from "./Navbar/Navbar"
import Searchbar from "./Searchbar"
import { AuthContext } from "../contexts/AuthContext";

function Profile() {

    // interface UserInfo {
    //     username: string;
    //     email: string;
    //     attributes?: Record<string, string>;
    // }

    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const { isAuthenticated, username, email, logout} = useContext(AuthContext)!;

    console.log("USER:", isAuthenticated, username, email )

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