import { useState } from 'react'
import CreateGroupModal from '../components/modals/CreateGroupModal'
import { useAuth } from '../contexts/AuthContext/useAuth';
import { handleLogin } from '../utils/authUtils';
import { useGroupContext } from '../contexts/GroupContext/useGroupContext';
import toast from 'react-hot-toast';

function Groups() {

    const { isAuthenticated } = useAuth();
    const { usersGroups } = useGroupContext();

    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState<boolean>(false)                                              

    const openCreateGroupModal = () => {
        if(!isAuthenticated) {
          console.log("Not logged in");
          toast((t) => (
            <div>
              You need to be logged in. Redirect to login page?
              <hr />
              <button onClick={() => handleLogin()}>
                Login
              </button>
              <button onClick={() => toast.dismiss(t.id)}>
                Dismiss
              </button>
            </div>
          ), { position: 'top-center'});
        } else {
          setIsCreateGroupModalOpen(true);
        }
    }

  return (
    <>
        <h1>Groups</h1>

        <button onClick={openCreateGroupModal}>Create New Group</button>

        <h3>Your groups</h3>

        {usersGroups ? (
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
                <p>No groups yet</p>
                )}

        
      {/* Create New Group modal */}
      {isCreateGroupModalOpen && <CreateGroupModal onClose={() => setIsCreateGroupModalOpen(false)}/>}
    </>
  )
}

export default Groups
