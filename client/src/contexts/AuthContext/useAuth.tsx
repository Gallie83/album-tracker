import { useContext } from "react";
import { AuthContext, AuthState } from "./AuthContext";

export const useAuth = (): Required<AuthState> => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
      }
      return context as Required<AuthState>;
};
