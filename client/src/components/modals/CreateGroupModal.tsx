import { useState } from "react"
import ReactDOM from "react-dom"

const CreateGroupModal = ({onClose}: {onClose: () => void}) => {

    const [groupName , setGroupName] = useState<string>("");
    const [description , setDescription] = useState<string>("");
    const [isPrivate , setIsPrivate] = useState<boolean>(true);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-black/50 z-50">
            <div className="w-full max-w-sm">
                <div className="relative rounded-2xl bg-white p-6 shadow">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Start New Listening Group</h2>
                        {/* Close Modal button */}
                    <button onClick={onClose} className="h-5 w-5 text-black">X</button>
                    </div>
                    <div className="text-black">
                        {/* Group Name input */}
                        <input 
                            type="text" 
                            className="mb-3 w-full rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Group Name"
                            value={groupName} 
                            onChange={(e) => setGroupName(e.target.value)}>
                        </input>
                        {/* Group description input */}
                        <input 
                            type="text" 
                            className="mb-3 w-full rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Description (Optional)"
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}>
                        </input>
                        {/* Private/Public input */}
                        <div className="flex gap-x-6">
                            <div className="flex">
                                <input 
                                    type="radio" 
                                    name="hs-radio-group" 
                                    className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" 
                                    id="hs-radio-group-1" 
                                    checked={isPrivate}
                                    onChange={() => setIsPrivate(true)}>
                                </input>
                                <label 
                                    htmlFor="hs-radio-group-1" 
                                    className="text-sm text-gray-500 ms-2 dark:text-neutral-400">
                                        Private
                                </label>
                            </div>

                            <div className="flex">
                                <input 
                                    type="radio" 
                                    name="hs-radio-group" 
                                    className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" 
                                    id="hs-radio-group-2"
                                    checked={!isPrivate}
                                    onChange={() => setIsPrivate(false)}>
                                </input>
                                <label 
                                    htmlFor="hs-radio-group-2" 
                                    className="text-sm text-gray-500 ms-2 dark:text-neutral-400">
                                        Public
                                </label>
                            </div>
                        </div>
                        <button className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-gray-800">Submit</button>
                    </div>
                </div>
            </div>
        </div>,
    document.getElementById("create-group-modal-root")!
    )
}

export default CreateGroupModal