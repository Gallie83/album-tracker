import { useState, useContext } from 'react';
import VinylImage from './vinyl-image.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const {isAuthenticated, username, logout} = useContext(AuthContext)!;

  const handleLogin = async () => {
    try {
        const returnUrl = '/profile';
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



  return (
    <>
      {/* Button with image */}
      <button
        // Toggles dropdown state
        onClick={() => setShowDropdown(!showDropdown)} 
        className='focus:outline-none'
      >
        <img src={VinylImage} alt="Vinyl Image" className="h-20 w-20 hover:animate-spin" />
      </button>

      {/* Conditional Dropdown */}
      {showDropdown && (
        <div className="mt-2 bg-white divide-y divide-gray-100 dark:bg-gray-700 shadow rounded-lg w-44">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              { isAuthenticated ? (
                <>
                {/* TODO: Ensure consistent styling for Navbar elements - Link + button */}
                  <li>
                    <Link
                      to={'/profile'}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                      {username}'s Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <a onClick={handleLogin}>Login</a>
                )}
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
