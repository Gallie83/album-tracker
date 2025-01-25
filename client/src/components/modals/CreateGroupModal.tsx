import ReactDOM from "react-dom"

const CreateGroupModal = ({onClose}: {onClose: () => void}) => {

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-black/50 z-50">
            <div className="w-full max-w-sm">
                <div className="relative rounded-2xl bg-white p-6 shadow">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Start New Listening Group</h2>
                    <button onClick={onClose} className="h-5 w-5 text-black">X</button>
                    </div>
                    <div className="text-black">
                        <input 
                            type="text" 
                            className="mb-3 w-full rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Group Name">
                        </input>
                    </div>
                </div>
            </div>
        </div>,
    document.getElementById("create-group-modal-root")!
    )
}

export default CreateGroupModal