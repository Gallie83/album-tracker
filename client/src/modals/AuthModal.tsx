import ReactDOM from "react-dom"
import { useAuth } from "../contexts/AuthContext/useAuth";
import { handleLogin } from "../utils/authUtils";

const AuthModal = ({onClose}: {onClose: () => void}) => {

    const {isAuthenticated, logout } = useAuth()

    // Close modal before logging user out to avoid modal content changing from Logged out -> Logged in before disappearing
    const handleLogout = () => {
        onClose();
        logout()
    }

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-black/50 z-50">
            <div className="w-full max-w-sm">
                <div className="relative rounded-2xl bg-white p-6 shadow">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            { isAuthenticated ? ("Are you sure?") : ("Authentication Required") }
                        </h2>
                        {/* Close Modal button */}
                        <button onClick={onClose} className="h-5 w-5 text-black">X</button>
                    </div>
                    <p className="text-black p-4 mb-4">
                    { isAuthenticated ? ("Continue to Logout?") : ("You need to login to access this feature") }
                    </p>
                    <hr className="border-t border-gray-200 mb-3" />
                        <div className="flex justify-end space-x-3">
                            <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                            Dismiss
                            </button>
                            { isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                    >
                                    Logout
                                </button>
                                ) : (
                                    <button
                                        onClick={() => handleLogin()}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                        >
                                        Login
                                    </button>
                                )}
                        </div>
                </div>
            </div>
        </div>,
    document.getElementById("auth-modal-root")!
    )
}

export default AuthModal