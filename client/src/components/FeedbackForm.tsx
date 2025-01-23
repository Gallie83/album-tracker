import { useState } from "react"
import ReactDOM from "react-dom"

const FeedbackForm = ({onClose}: {onClose: () => void}) => {
    const [feedback, setFeedback] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    // Sends email with feedback to my gmail account
    const submitFeedback = async () => {
        try{
            const response = await fetch('http://localhost:5000/submit-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({feedback, email})
            });

            if(!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            console.log("FEEDBACK feedback",feedback)
            alert('Thank you for your feedback!')
            setFeedback("");
            setEmail("");
            onClose()
        } catch (error) {
        console.error("Error sending feedback:",error)
        }
    }

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-black/50 z-50">
            <div className="w-full max-w-sm">
                <div className="relative rounded-2xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Leave feedback</h2>
                <button onClick={onClose} className="h-5 w-5 text-black">X</button>
                </div>
                <div className="text-black">
                    {/* <label htmlFor="email">Your Email (Optional)</label> */}
                    <input 
                        type="email" 
                        className="mb-3 w-full rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Your Email (Optional)"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}>
                    </input>
                    <textarea 
                        className="mb-3 w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" 
                        rows={4} 
                        placeholder="Your feedback..." 
                        value={feedback} 
                        onChange={(e) => setFeedback(e.target.value)}>
                    </textarea>
                </div>
                {/* <div className="mb-4 flex justify-start gap-2">
                    <button className="text-md rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50">😞</button>
                    <button className="text-md rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50">😐</button>
                    <button className="text-md rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50">😊</button>
                </div> */}
                <button onClick={submitFeedback} className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-gray-800">Submit</button>
                </div>
            </div>
        </div>,
    document.getElementById("modal-root")!
    )
}

export default FeedbackForm