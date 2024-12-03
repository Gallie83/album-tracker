/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
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
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults>();
  const params = useParams<{searchQuery:string}>();

  // Tracks searchValue input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    const searchQuery = params.searchQuery || "";
    setSearchValue(searchQuery);
    handleSearch(searchValue)
}, [params])
  
  const handleSearch = async (query: string) => {
    try {
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

  return (
    <>
    <Link to={'/'}>
    <h1 className='text-9xl'>VYNYL</h1>
    </Link>

{/* Search input for users to search for albums */}
<input 
  placeholder='Searching for ...'
  type="text"
  value={searchValue} 
  onChange={handleInputChange}
  className='text-black m-2 p-2'
/>


<Link to={`/search/${searchValue}`} className='m-3 p-1 border-2 border-white-600' onClick={() => handleSearch(searchValue)}>Search</Link>
    

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
