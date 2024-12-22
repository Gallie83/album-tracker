import React, {createContext, useState, Dispatch, SetStateAction} from "react";

interface AuthState {
    isAuthenticated: boolean,
    username: string | null,
    email: string | null,
    setAuthState?: Dispatch<SetStateAction<AuthState>>
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({children}) => {
    const [authState, setAuthState] = useState<Omit<AuthState, "setAuthState">>({
        isAuthenticated: false,
        username: null,
        email: null,
    })

    return(
        <AuthContext.Provider value={{ ...authState, setAuthState }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext };
export type { AuthState };
