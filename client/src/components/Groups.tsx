import { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar/Navbar'
import Searchbar from './Searchbar'
import CreateGroupModal from './modals/CreateGroupModal'
import { useAuth } from '../contexts/AuthContext/useAuth';
import { handleLogin } from '../utils/authUtils';

interface Group {
    title: string,
    description: string,
    private: boolean,
    members: [],
    albums: []
}

function Groups() {

    const { isAuthenticated, cognitoId } = useAuth();

    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState<boolean>(false)
    const [usersGroups, setUsersGroups] = useState<Group[]>([])                                                

    const openCreateGroupModal = () => {
        if(!isAuthenticated) {
            if(window.confirm('You need to be logged in. Redirect to login page?')) {
                handleLogin()
                return;
            }
        } else {
          setIsCreateGroupModalOpen(true);
        }
    }

    const getUsersGroups = useCallback(async () => {
        console.log("RUNNING")
        console.log("ID:" ,cognitoId)
        if(!isAuthenticated) {return;}
            try {
                const response = await fetch(`http://localhost:5000/${cognitoId}/groups`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const groups = await response.json();
                setUsersGroups(groups);
            } catch (error) {
                console.error('Faled to fetch users groups:', error);
            }
        }, [cognitoId, isAuthenticated]);
        
    useEffect(() => {
        getUsersGroups();
    }, [getUsersGroups])
    
    useEffect(() => {
        console.log("GROUPS:", usersGroups)
    }, [usersGroups])


  return (
    <>
        <div className="flex fixed top-0 left-0 ml-3 mt-3">
            <Navbar />
        </div>

        <Searchbar/>

        <div>Groups</div>

        <button onClick={openCreateGroupModal}>Create New Group</button>

        <h3>Your groups</h3>

        {usersGroups ? (usersGroups.map((group) => (<p>{group.title}</p>))) : (<p>No groups yet</p>)}

        
      {/* Create New Group modal */}
      {isCreateGroupModalOpen && <CreateGroupModal onClose={() => setIsCreateGroupModalOpen(false)}/>}
    </>
  )
}

export default Groups
