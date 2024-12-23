import React, {createContext, useState, Dispatch, SetStateAction, useEffect} from "react";

interface AuthState {
    isAuthenticated: boolean,
    username: string | null,
    email: string | null,
    // To handle Login/Logout
    setAuthState?: Dispatch<SetStateAction<AuthState>>,
    logout?: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({children}) => {
    // Intialise AuthState while Omitting setAuthState value 
    const [authState, setAuthState] = useState<Omit<AuthState, "setAuthState" | "logout">>({
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
                        isAuthenticated: true,
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
                setAuthState({
                    isAuthenticated: false,
                    username: null,
                    email: null,
                });
            }
        };

        checkAuth();
    }, []);

    // Function to log user out and reset authState
    const logout = () => {
        // Return State to Unauthenticated
        setAuthState({
            isAuthenticated: false,
            username: null,
            email: null,
        });
        fetch('http://localhost:5000/logout', {
            method: 'POST',
            credentials: 'include',
        })
        .then((response) => {
            if (!response.ok) {
                return response.text().then((text) => {
                    console.error('Failed to log out on the server:', text);
                });
            }
            console.log('Logout successful on the server');
        })
        .catch((error) => {
            console.error('Error logging out:', error);
        });
        
    }

    return(
        <AuthContext.Provider value={{ ...authState, logout }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext };
export type { AuthState };
