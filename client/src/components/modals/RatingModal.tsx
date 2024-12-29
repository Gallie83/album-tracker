import { useState } from "react";


import VinylImage from '../Navbar/vinyl-image.png'

function RatingModal() {

  // State for ratings
  const [hoverIndex, setHoverIndex] = useState(0);
  const [valueIndex, setValueIndex] = useState(0);

  // const addToUsersAlbums = async (mbid: string, title: string, artist: string) => {
  //   try {
  //     const albumData = {albumId: mbid, title, artist};
  //     console.log(albumData)

  //     const response = await fetch(`http://localhost:5000/rate-album`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify(albumData),
  //     });

  //     if(!response.ok) {
  //       throw new Error(`Error: ${response.status}`)
  //     }

  //     const data = await response.json();
  //     console.log('Data:', data)
  //   } catch (error) {
  //     console.error('Error adding album to list:', error)
  //   }
  // }
      
  return(
    <>
            <div data-modal-backdrop="static" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    {/* Modal content  */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header  */}
                        <div className="flex justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Rate the album
                            </h3>
                            {/* Close modal button */}
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">X</button>
                        </div>
                        {/* Modal body  */}
                        <div className="flex flex-row justify-center p-10">
                          {[...Array(5)].map((_, index) => (
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
                              onClick={() => setValueIndex(hoverIndex)}
                            >
                              <img src={VinylImage} alt="Vinyl" className="w-8 h-8" />
                            </div>
                          ))}
                        </div>
                        
                        {/* Modal footer  */}
                        <div className="flex items-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Skip</button>
                            <button type="button" className="ms-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Rate</button>
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default RatingModal