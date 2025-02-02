import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom"
import RatingModal from "../../modals/RatingModal";
import AuthModal from "../../modals/AuthModal"
import { useAuth } from "../../contexts/AuthContext/useAuth";
import { useAlbumContext } from "../../contexts/AlbumContext/useAlbumContext";
import { useGroupContext } from "../../contexts/GroupContext/useGroupContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { handleLogin } from "../../utils/authUtils";
import toast from "react-hot-toast";
import CreateGroupModal from "../../modals/CreateGroupModal";

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
  const [isSaved, setIsSaved] = useState<boolean>(false)
  const [updatingRating, setUpdatingRating] = useState<boolean>(false)
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)

  // Modals
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState<boolean>(false)
  // Contexts
  const { isAuthenticated } = useAuth();
  const { usersAlbums, setUsersAlbums, savedAlbums, setSavedAlbums} = useAlbumContext();
  const { usersGroups, setUsersGroups } = useGroupContext();

  // Hash albums name+artist to use as ID, as mbid missing from majority of albums
  const generateId = (albumName: string, artistName: string) => {
    const text = `${albumName.toLowerCase()}-${artistName.toLowerCase()}`;
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    .then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join('');
      return hashHex;
    })
  }

  const openRatingModal = (hashId: string) => {
    // Check Authentication
    if(isAuthenticated) {
      // Check if album is already in list
      if(usersAlbums!.some(album => album.id === hashId)) {
        const changeRating = window.confirm("This album is already in your list. Update rating?") 
        if(changeRating) {
          setUpdatingRating(true);
        } else {
          return;
        }
      }
      setIsRatingModalOpen(true)
    } else {
      // Open AuthModal
      setIsAuthModalOpen(true)
    }
  }
  
  // Fetch Album info and store it in state
  const albumInfo = useCallback(async (artist: string, album: string) => {
    try {
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`);
      const data = await response.json()

      if (data.album) {
        // Check if tracklist is an array/single object
        const tracks = Array.isArray(data.album.tracks.track)
          ? data.album.tracks.track // It's an array
          : [data.album.tracks.track]; // Wrap single object in an array
      
        const hashId = await generateId(album, artist);

        // Check if album is already in usersSavedAlbums
        if(savedAlbums?.some(album => album.id === hashId)) {
          setIsSaved(true)
        }

        const fetchedAlbum: AlbumInfo = {
          hashId,
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
          url: data.album.url
        };
        setAlbum(fetchedAlbum);
      }  
    } catch(error) {
      console.error(error)
    }
  }, [savedAlbums]);

  useEffect(() => {
      if(params.artistName && params.albumName) {
        albumInfo(params.artistName, params.albumName)
      }
  }, [params, albumInfo])

  // Adds album to usersAlbums/usersSavedAlbums array
  // TODO: Allow user to create their own lists with custom names
  const addToUsersAlbums = async (hashId: string, title: string, artist: string, rating: number | null) => {
    try {
      const albumData = {albumId: hashId, title, artist, rating};

      // Save album if new, update rating if existing
      const route = updatingRating ? 'update-rating' : 'save-album'; 

      const response = await fetch(`http://localhost:5000/${route}`, {
        method: updatingRating ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(albumData),
      });

      if(!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

    // Update albums in context after they're added with success toast
    if (rating === 0) {
      setSavedAlbums((prev) => [
        ...(prev?.filter((album) => album.id !== hashId) || []),
        { ...albumData, id: albumData.albumId }, 
      ]);
      toast.success('Album added to Saved Albums')
    } else {
      setUsersAlbums((prev) => [
        ...(prev?.filter((album) => album.id !== hashId) || []),
        { ...albumData, id: albumData.albumId }, 
      ]);
      toast.success('Album added to MyAlbums')
    }

    } catch (error) {
      let message = 'Failed to add album to list';
      if(error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error
      }
      toast.error(message)
    }
  }

  // Delete album from users list
  const removeAlbum = async (albumId:string, rating: number | null) => {
    console.log("Deleting...")
    console.log("SAVED ALBUMS:",savedAlbums)
    try {    
      const response = await fetch('http://localhost:5000/remove-album', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({albumId, rating})
        });

      if(!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
    } catch (error) {
      console.error("Error removing album:",error)
    }
  }

  // Adds album to a group user selects from usersGroups
  const addToGroup = async ( groupId:string, title: string, artist: string, hashId: string ) => {
    try {
      // Check group exists
      const group = usersGroups!.find((group) => group._id === groupId);
      if(!group) {
        throw new Error('Group not found')
      }

      // Check if album already exists in group
      const albumExists = group.albums.some((album: {hashId: string}) => album?.hashId === hashId);
      if(albumExists) {
        throw new Error('Album already exists in this group')
      }

      const response = await fetch(`http://localhost:5000/groups/add-album/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({title, artist, hashId}),
      });

      if(!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const updatedGroup = await response.json();

      // Update state in GroupContext once response is okay
      setUsersGroups(prevGroups => 
        prevGroups ? prevGroups.map(
          group => group._id === groupId ? updatedGroup : group
        ) : [updatedGroup]
      );

      toast.success(`Album added to ${updatedGroup.title}`)

    } catch (error) {
      let message = 'Failed to add album to group';
      if(error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error
      }
      toast.error(message)
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
    setIsRatingModalOpen(false)
    setUpdatingRating(false);
  }

  // Controls bookmarking
  const toggleBookmarkFunction = async (id:string, title:string, artist:string , rating: number) => {
    // Save if logged in
    if(isAuthenticated) {
        if(isSaved) {
          await removeAlbum(id, 0)
        } else {
          await addToUsersAlbums(id, title, artist, rating)
        }
        setIsSaved(!isSaved);
    } else {
      // Open AuthModal
      setIsAuthModalOpen(true)
    }
  }
      
  return(
    <>
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
                }}>
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
            <div className="w-3/5 text-black bg-green-300 flex flex-col justify-between p-6 px-16 leading-normal">

              <div>
            {/* Opens RatingModal */}
                <button 
                  onClick={() => openRatingModal(album.hashId)}
                  data-testid="toggleModalButton">
                    Add
                </button>
                <br />

                <div className="relative inline-block text-left">
                  <div>
                    <button onClick={() => setShowGroupDropdown(!showGroupDropdown)} type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50" >
                      Add to Group
                      <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                      </svg>
                    </button>

                  {/* Dropdown for user to select which group to add album */}
                  { showGroupDropdown && (
                    <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                      <div className="py-1" role="none">
                        {/* Conditionally render usersGroups if user is logged in */}
                        {isAuthenticated ? (
                          // Check if usersGroups has content
                          usersGroups && usersGroups.length > 0 ? (
                            usersGroups.map((group: { _id: string; title: string }) => (
                              <button
                                key={group._id}
                                onClick={() => addToGroup(group._id, album.title, album.artist, album.hashId)}
                                className="block px-4 py-2 text-sm text-gray-700"
                              >
                                {group.title}
                              </button>
                            ))
                          ) : (
                            // If no usersGroups, link to open CreatGroupModal
                            <div className="p-3 flex flex-col">
                              <div className="p-3 mx-auto">
                                <b>No groups yet</b>
                              </div>
                              <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow" onClick={() => setIsCreateGroupModalOpen(true)}>Create Group?</button>
                            </div>
                          )
                        ) : (
                          <div className="p-3">
                            <p><button onClick={handleLogin} className="text-blue-700">Login</button> to access group features</p>
                            </div>
                        )}
                      </div>
                    </div>
                  )}

                  </div>
                </div>

                <br />

                {/* Bookmark Icon */}
                <FontAwesomeIcon 
                  data-testid="bookmark-button"
                  onClick={() => toggleBookmarkFunction(album.hashId, album.title, album.artist, 0)} 
                  icon={faBookmark} 
                  color={ isSaved ? 'black' : 'white'} />
              </div>

            <div>
              <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{album.title}</h4>
              <Link to={`/artist-info/${album.artist}`} className="mb-3 font-normal text-gray-700 dark:text-gray-400">{album.artist}</Link>
            </div>

            {/* Album information */}
            <div data-testid="description" className="mt-4 border-t pt-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {album.description}
            </div>

            {/* Link to Album page on Last.fm */}
              <a data-testid="more-info" target="_blank" rel="noopener noreferrer" className="border border-black p-1 bg-stone-400" href={album.url}>More info</a>

            </div>
          </div>

          
          {/* Rating modal  */}
          {isRatingModalOpen && ( 
            <RatingModal 
              data-testid="rating-modal"
              closeModal={closeModal}
              onSubmitRating={handleRating}>
            </RatingModal> 
          )}
          
          {/* Authentication modal */}
          {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)}/>}

          {/* Create New Group modal */}
          {isCreateGroupModalOpen && <CreateGroupModal onClose={() => setIsCreateGroupModalOpen(false)}/>}

            
        </div>
      
  ) : ( <p>ERROR</p> )}
    </>
  )
}

export default AlbumInfo