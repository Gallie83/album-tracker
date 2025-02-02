import { useState } from 'react'
import CreateGroupModal from '../modals/CreateGroupModal'
import { useAuth } from '../contexts/AuthContext/useAuth';
import { useGroupContext } from '../contexts/GroupContext/useGroupContext';
import AuthModal from '../modals/AuthModal';

function Groups() {

  // Modals
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState<boolean>(false)    
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);                                          

  // Contexts
  const { isAuthenticated } = useAuth();
  const { usersGroups } = useGroupContext();


  const openCreateGroupModal = () => {
    if(!isAuthenticated) {
      // Open AuthModal
      setIsAuthModalOpen(true)
      } else {
        setIsCreateGroupModalOpen(true);
    }
  }

  return (
    <>
        <h1>Groups</h1>

        <button onClick={openCreateGroupModal}>Create New Group</button>

        <h3>Your groups</h3>

        {usersGroups && usersGroups.length > 0 ? (
            usersGroups.map((group: { _id: string; title: string; description: string;}) => (
                <div className='bg-white text-black flex-col'>
                  <div
                    className="bg-slate-500 px-3 py-2 mx-3 my-2 rounded-lg"
                    key={group._id}>

                    <div className='mt-3'>
                    <h2 className="font-bold text-ellipsis overflow-hidden line-clamp-2">{group.title}</h2>
                    <p className='text-ellipsis overflow-hidden line-clamp-1'>{group.description}</p>
                    </div>

                  </div>
                </div>
          ))) : (
          <p>No groups yet!</p>
          )}

        
      {/* Create New Group modal */}
      {isCreateGroupModalOpen && <CreateGroupModal onClose={() => setIsCreateGroupModalOpen(false)}/>}

      {/* Authentication modal */}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)}/>}
    </>
  )
}

export default Groups
