import { useState } from 'react';
import VinylImage from './vinyl-image.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import FeedbackFormModal from '../modals/FeedbackFormModal';
import { handleLogin } from '../../utils/authUtils';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const {isAuthenticated, username, logout} = useAuth();

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false)

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
        data-testid="navbar-button"
      >
        <img src={VinylImage} alt="Vinyl Image" className="h-20 w-20 hover:animate-spin" />
      </button>

      {/* Conditional Dropdown */}
      {showDropdown && (
        <div data-testid="navbar" className="mt-2 bg-white divide-y divide-gray-100 dark:bg-gray-700 shadow rounded-lg w-44">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              { isAuthenticated ? (
                <>
                {/* TODO: Ensure consistent styling for Navbar elements - Link + button */}
                  <li>
                    <Link
                      to={'/profile'}
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
              <Link
                to={'/groups'}>
                  Groups
              </Link>
            </li>
            <li>
              <button onClick={() => setIsFeedbackModalOpen(true)}>
                Submit Feedback
              </button>
            </li>            
          </ul>
        </div>
      )}

      {/* Submit feedback modal */}
      {isFeedbackModalOpen && <FeedbackFormModal onClose={() => setIsFeedbackModalOpen(false)}/>}
    </>
  );
}

export default Navbar;
