import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const apiKey = import.meta.env.VITE_APP_API_KEY;

// Interfaces
interface Album {
  id: string,
  title: string,
  artist: string,
  imageUrl: string 
}

interface SearchResults {
  results: Album[]
} 

function SearchPage() {
  
  const [searchResults, setSearchResults] = useState<SearchResults>();
  const params = useParams<{searchQuery:string}>();
  const navigate = useNavigate();
  
  const handleSearch = async (query: string) => {
    if(!query) return;
    try {
      console.log("Starting")
      // Searches for albums based on user input for searchValue
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=${apiKey}&format=json`)
      const data = await response.json()
      console.log(data)
        // Maps results to searchResults state to match SearchResults interface
        setSearchResults({
          results: data.results.albummatches.album.map((release: {
            id: string,
            name: string;
            date: string;
            artist: string;
            image: { "#text": string; size: string }[];
          }) => ({
            id: uuidv4(),
            title: release.name,
            artist: release.artist,
            imageUrl: release.image?.find(img => img.size === "extralarge")?.["#text"] || ""
          }))
        });
    } catch(error) {
      console.log('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const searchQuery = params.searchQuery || "";
    console.log(searchQuery)
    handleSearch(searchQuery)
  }, [params])

  const searchRedirect = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchValue = event.currentTarget.search.value
    if(searchValue.trim()) {
      navigate(`/search/${searchValue}`, {replace: true});
    }
  }

  return (
    <>
    <Link to={'/'}>
    <h1 className='text-9xl'>VYNYL</h1>
    </Link>

    {/* Search input for album searching */}
    <form onSubmit={searchRedirect}  className="flex px-4 py-3 rounded-md border-2 overflow-hidden max-w-md mx-auto font-[sans-serif]">
  
      <input 
        placeholder='Search for Albums'
        type="text"
        name="search" 
        defaultValue={params.searchQuery || ""}
        className='w-full outline-none bg-transparent text-gray-600 text-sm'
      />

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-600">
        <path
          d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
        </path>
      </svg>
      
    </form>   

    {/* Check if searchResults exists and then map through releases */}
    {searchResults?.results ? (
  // Display search results in a grid
  <div className="grid grid-cols-4 gap-5">
    {searchResults.results.map((album) => (
      <Link
        to={`/album-info/${album.artist}/${album.title}`}
        className="bg-slate-500 p-5 m-5 rounded-lg"
        key={album.id}
      >
        <img className="size-72" src={album.imageUrl} alt="Album art" />
        <h2 className="font-bold">{album.title}</h2>
        <p>Artist: {album.artist}</p>
      </Link>
    ))}
  </div>
) : ( <p>Nothing</p> )}

    </>
  )
}

export default SearchPage;
