import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";

interface Group {
    _id: string,
    title: string,
    description: string,
    private: boolean,
    members: [],
    albums: []
}

interface GroupContextType {
    usersGroups: Group[] | null;
    setUsersGroups: React.Dispatch<React.SetStateAction<Group[] | null>>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const { isAuthenticated, cognitoId } = useContext(AuthContext)!;

    const [usersGroups, setUsersGroups] = useState<Group[] | null>(null);

    useEffect(() => {
        const getUsersGroups = async () => {
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
        }
    // Only fetch if the user is logged in
    if (isAuthenticated) {
        getUsersGroups();
      }
    }, [isAuthenticated, cognitoId]);

    return (
        <GroupContext.Provider value={{ usersGroups, setUsersGroups}}>
            {children}
        </GroupContext.Provider>
    )
}

export {GroupContext}
export type {GroupContextType}

