import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom"
import Navbar from "./Navbar/Navbar";
import Searchbar from "./Searchbar";
import RatingModal from "./modals/RatingModal";
import { AuthContext } from "../contexts/AuthContext";

const apiKey = import.meta.env.VITE_APP_API_KEY;

interface AlbumInfo {
    hashId: string,
    title: string,
    artist: string,
    imageUrl: string,
    trackList: {
        name: string,
    }[], 
    description: string,
    url: string 
}

function AlbumInfo() {
  const params = useParams<{artistName:string , albumName: string, albumHashId: string}>();
  const [album, setAlbum] = useState<AlbumInfo>();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { isAuthenticated } = useContext(AuthContext)!;
  
  const albumInfo = async (artist: string, album: string, hashId: string) => {
    try {
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`);
      const data = await response.json()
      console.log("ALBUM DATA:", data)
      if (data.album) {
        // Check if tracklist is an array/single object
        const tracks = Array.isArray(data.album.tracks.track)
          ? data.album.tracks.track // It's an array
          : [data.album.tracks.track]; // Wrap single object in an array
      
        const fetchedAlbum: AlbumInfo = {
          hashId: hashId,
          title: album,
          artist: artist,
          imageUrl:
            data.album.image?.find(
              (img: { "#text": string; size: string }) => img.size === "extralarge"
            )?.["#text"] || "",
          trackList: tracks.map((track: { name: string; rank: number }) => ({
            name: track.name,
            rank: track.rank,
          })),
          description: data.album.wiki?.content || "No description available.",
          url: data.album.url,
        };
        setAlbum(fetchedAlbum);
      }  
    } catch(error) {
      console.error(error)
    }
  } 

  useEffect(() => {
      if(params.artistName && params.albumName && params.albumHashId )
      albumInfo(params.artistName, params.albumName, params.albumHashId)
  }, [params])

  // Adds album to usersAlbums array
  const addToUsersAlbums = async (hashId: string, title: string, artist: string, rating: number | null) => {
    try {
      const albumData = {albumId: hashId, title, artist, rating};
      console.log(albumData)

      const response = await fetch(`http://localhost:5000/rate-album`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(albumData),
      });

      if(!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json();
      console.log('Data:', data)
    } catch (error) {
      console.error('Error adding album to list:', error)
    }
  }

  // Receives rating from RatingModal(or as null if user decided to skip)
  const handleRating = (rating: number | null) => {
    console.log("Value received:", rating)
    if(album) {
      addToUsersAlbums(album.hashId, album.title, album.artist, rating);
      closeModal();
    }
  }

  const closeModal = () => {
    setModalOpen(false)
  }
      
  return(
    <>
      <div className="flex fixed top-0 left-0 ml-3 mt-3">

      <Navbar />
      </div>

      <Searchbar/>
      {album ? (
        // Outer div
        <div className="flex items-center justify-center h-screen">
          <div key={album.hashId} className="flex w-11/12 items-stretch bg-pink-300 border border-gray-200 rounded-lg md:flex-row p-5">
            {/* Left Section with Image and Track List */}
            <div className="flex flex-col w-2/5 p-2 bg-slate-600">
              <img
                className={`object-contain transition duration-700 ease-in-out ${
                  open ? "max-h-48" : "max-h-auto"
                }`}
                src={album.imageUrl}
                alt="Album Art"
              />
              {/* Track List Accordion */}

              {/* Accordion open button */}
              <div className="w-full mt-4 relative">
              {/* Wrapper for both label and menu */}
              <div
                className={`transition-all duration-700 ease-in-out relative`}
                style={{
                  // Move label up when open
                  transform: open ? "translateY(-3rem)" : "translateY(0)", 
                }}
              >
                {/* Track List Button */}
                <label
                  htmlFor="trackListToggle"
                  className={`flex justify-center items-center bg-blue-500 hover:bg-blue-100 hover:text-black transition-all duration-700 ease-in-out cursor-pointer`}
                  onClick={() => setOpen(!open)}
                >
                  Track List
                </label>

                {/* Accordion Menu */}
                <div
                  className={`overflow-hidden bg-slate-300 transition-all duration-700 ease-in-out`}
                  style={{
                    maxHeight: open ? "" : "0", // Menu height goes from 0 to auto
                    transform: open ? "scaleY(1)" : "scaleY(0)", // Expand menu from top to bottom
                    transformOrigin: "top", // Menu expands from top
                  }}
                >
                  {album.trackList.map((track, index) => (
                    <p key={index} className="text-black px-4 py-1">
                      {index + 1}. {track.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            </div>
            
            {/* Right Section with Summary */}
            <div className="w-3/5 bg-green-300 flex flex-col justify-between p-6 px-16 leading-normal">

            {/* If user is logged in, button opens RatingModal */}
            { isAuthenticated && (
              <button 
              onClick={() => setModalOpen(true)}
              data-modal-target="static-modal">
                  Add
              </button>
            )}

            <div>
              <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{album.title}</h4>
              <Link to={`/artist-info/${album.artist}`} className="mb-3 font-normal text-gray-700 dark:text-gray-400">{album.artist}</Link>
            </div>

            {/* Album information */}
            <div className="mt-4 border-t pt-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {album.description}
            </div>

            {/* Link to Album page on Last.fm */}
              <a target="_blank" rel="noopener noreferrer" className="border border-black p-1 bg-stone-400" href={album.url}>More info</a>

            </div>

            {/* Rating modal  */}
            {modalOpen && ( <RatingModal 
                              closeModal={closeModal}
                              onSubmitRating={handleRating}>
                            </RatingModal> 
                          )}

          </div>
        </div>

          
      
  ) : ( <p>ERROR</p> )}
    </>
  )
}

export default AlbumInfo