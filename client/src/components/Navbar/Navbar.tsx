import { useState } from 'react';
import VinylImage from './vinyl-image.png';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <>
      {/* Button with image */}
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        onClick={() => setShowDropdown(!showDropdown)} // Correctly toggles the state
      >
        <img src={VinylImage} alt="Vinyl Image" className="h-28 w-28" />
      </button>

      {/* Conditional Dropdown */}
      {showDropdown && (
        <div
          id="dropdown"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Earnings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sign out
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
