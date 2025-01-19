const FeedbackForm = () => {
  return (
        <div className="flex min-h-screen items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-sm">
                <div className="relative rounded-2xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Leave feedback</h2>
                    <button className="absolute right-5 top-5 text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    </button>
                </div>
                <p className="mb-4 text-center text-sm">We'd love to hear what went well or how we can improve the product experience.
                </p>
                <textarea className="mb-3 w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="Your feedback..."></textarea>
                <div className="mb-4 flex justify-start gap-2">
                    <button className="text-md rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50">😞</button>
                    <button className="text-md rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50">😐</button>
                    <button className="text-md rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50">😊</button>
                </div>
                <button className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-gray-800">Submit</button>
                </div>
            </div>
        </div>
  )
}

export default FeedbackForm