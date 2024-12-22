import React, {createContext, useState, Dispatch, SetStateAction, useEffect} from "react";

interface AuthState {
    isAuthenticated: boolean,
    username: string | null,
    email: string | null,
    setAuthState?: Dispatch<SetStateAction<AuthState>>
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({children}) => {
    // Intialise AuthState while Omitting setAuthState value 
    const [authState, setAuthState] = useState<Omit<AuthState, "setAuthState">>({
        isAuthenticated: false,
        username: null,
        email: null,
    })

    useEffect(() => {

        // Check if user is logged in 
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/', {
                    method: 'GET',
                    credentials: 'include', // Ensure cookies are sent
                });
                if (response.ok) {
                    const data = await response.json();
                    // Set User info with pref_username as username
                    setAuthState({
                        ...data.userInfo,
                        username: data.userInfo.preferred_username
                    });
                } else {
                    console.error('Failed to fetch authentication status');
                    setAuthState({
                        isAuthenticated: false,
                        username: null,
                        email: null,
                    });
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };
        console.log("UserInfo:", authState)

        checkAuth();
    }, [])

    return(
        <AuthContext.Provider value={{ ...authState }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext };
export type { AuthState };
