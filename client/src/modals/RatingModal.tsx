import { useState } from "react";
import VinylImage from '../components/Navbar/vinyl-image.png'
import toast from "react-hot-toast";

function RatingModal( {onSubmitRating, closeModal }: { onSubmitRating: (rating: number | null) => void; closeModal: () => void } ) {

  // State for ratings
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [valueIndex, setValueIndex] = useState<number | null>(null);

  // Pass rating back to AlbumInfo
  const handleSubmit = () => {
    if(!valueIndex) {
      toast.error("You have not selected a rating value")
      return
    }
    onSubmitRating(valueIndex+1)
  }

  // Pass null as rating for AlbumInfo
  const handleSkip = () => {
    onSubmitRating(null)
  } 

  // Closes Modal by changing state in AlbumInfo.tsx 
  const handleCloseModal = () => {
    closeModal();
  }
      
  return(
    <div 
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content  */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header  */}
                <div className="flex justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Rate this album
                    </h2>
                    {/* Close modal button */}
                    <button 
                        type="button" 
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => handleCloseModal()}
                        >
                            X
                    </button>
                </div>
                {/* Modal body  */}
                <div className="flex flex-row justify-center p-10">
                  {/* Using VinylImage as Star-rating */}
                    {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className={`w-12 h-12 mx-2 flex items-center justify-center cursor-pointer ${
                        // Values greyed out until hovered over/clicked
                        hoverIndex !== null && hoverIndex >= index
                        ? "opacity-90"
                        : valueIndex !== null && valueIndex >= index
                        ? "opacity-90"
                        : "opacity-50"
                        }`}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(-1)} // Reset hover index when not hovering
                        onClick={() => setValueIndex(index)}
                    >
                        <img src={VinylImage} alt="Vinyl" className="w-8 h-8" />
                    </div>
                    ))}
                </div>
                
                {/* Modal footer  */}
                <div className="flex items-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button onClick={handleSkip} type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Add without rating</button>
                    <button onClick={handleSubmit} type="button" className="ms-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add with Rating</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RatingModal