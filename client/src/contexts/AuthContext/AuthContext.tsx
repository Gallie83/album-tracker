import React, {createContext, useState, Dispatch, SetStateAction, useEffect} from "react";

interface AuthState {
    isAuthenticated: boolean,
    username: string | null,
    email: string | null,
    cognitoId: string | null,
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
        cognitoId: null,
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

                    if (data && data.userInfo && data.userInfo.preferred_username) {
                        // Set User info with preferred_username as username
                        setAuthState({
                            isAuthenticated: true,
                            ...data.userInfo,
                            username: data.userInfo.preferred_username
                        });
                    } else {
                        // If User not logged in then reset state
                        setAuthState({
                            isAuthenticated: false,
                            username: null,
                            email: null,
                            cognitoId: null,
                        });
                    }
                } else {
                    console.error('Failed to fetch authentication status', response.statusText);
                    setAuthState({
                        isAuthenticated: false,
                        username: null,
                        email: null,
                        cognitoId: null,
                    });
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setAuthState({
                    isAuthenticated: false,
                    username: null,
                    email: null,
                    cognitoId: null,
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
            cognitoId: null,
        });
        // Call to servers logout route which will then redirect to homepage
        window.location.href = 'http://localhost:5000/logout'
    }

    return(
        <AuthContext.Provider value={{ ...authState, logout }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext };
export type { AuthState };
