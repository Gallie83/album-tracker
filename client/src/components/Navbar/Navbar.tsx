import { useState, useContext } from 'react';
import VinylImage from './vinyl-image.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const {isAuthenticated, username} = useContext(AuthContext)!;

  const handleLogin = async () => {
    try {
        const returnUrl = window.location.pathname || '/';
        window.location.replace(`http://localhost:5000/login?returnUrl=${returnUrl}`);
    } catch (error) {
        console.error('Login failed:', error);
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
        <div
        className="mt-2 bg-white divide-y divide-gray-100 dark:bg-gray-700 shadow rounded-lg w-44"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
          >
            <li>
              {/* TODO: Add conditional render if user is logged on or not */}
              { isAuthenticated ? (
                <Link
                  to={'/profile'}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                  {username}'s Profile
                </Link>
              ) : (
                <li onClick={handleLogin}>Login</li>
                )}
            </li>
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
