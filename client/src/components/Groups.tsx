import { useState } from 'react'
import Navbar from './Navbar/Navbar'
import Searchbar from './Searchbar'
import CreateGroupModal from './modals/CreateGroupModal'
import { useAuth } from '../contexts/AuthContext/useAuth';
import { handleLogin } from '../utils/authUtils';

function Groups() {

      const { isAuthenticated } = useAuth();
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState<boolean>(false)

    const openNewGroupModal = () => {
        if(!isAuthenticated) {
          if(window.confirm('You need to be logged in. Redirect to login page?')) {
            handleLogin()
            return;
          }
        } else {
          setIsCreateGroupModalOpen(true);
        }
      }

  return (
    <>
        <div className="flex fixed top-0 left-0 ml-3 mt-3">
            <Navbar />
        </div>

        <Searchbar/>
        <div>Groups</div>

        <button onClick={openNewGroupModal}>Create New Group</button>

        
      {/* Create New Group modal */}
      {isCreateGroupModalOpen && <CreateGroupModal onClose={() => setIsCreateGroupModalOpen(false)}/>}
    </>
  )
}

export default Groups
