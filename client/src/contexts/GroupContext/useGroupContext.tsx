import { useContext } from "react";
import { GroupContext, GroupContextType } from './GroupContext'

// Hook for using GroupContext
export const useGroupContext = (): GroupContextType => {
    const context = useContext(GroupContext);
    if(!context) {
        throw new Error("useGroupContext must be used within GroupProvider");
    }
    return context;
}