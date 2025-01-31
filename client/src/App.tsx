import './App.css'
import { Outlet } from 'react-router-dom';

import Searchbar from './components/Searchbar';
import Navbar from './components/Navbar/Navbar';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <div className="fixed top-0 left-0 ml-3 mt-3 z-50">
      <Navbar />
      </div>

      <Searchbar/>

      <Outlet/>
      <Toaster
        position="top-right"
      />
    </>
  )
}

export default App
