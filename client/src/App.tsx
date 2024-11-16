import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom';
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



function App() {
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults>();

  // Tracks searchValue input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  const handleSearch = async () => {
    try {
      // Searches for albums based on user input for searchValue
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchValue}&api_key=${apiKey}&format=json`)
      const data = await response.json()
      console.log(data.results.albummatches.album)
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
    <h1 className='text-9xl'>Album Search</h1>

    {/* Search input for users to search for albums */}
    <input 
      placeholder='Searching for ...'
      type="text"
      value={searchValue} 
      onChange={handleInputChange}
      className='text-black m-2 p-2'
    />

    {/* <button className="group relative cursor-pointer">
        <div className="bg-white">
            <a className="menu-hover text-black">
                Artist/Album
            </a>
        </div>

        <div
            className="invisible absolute z-50 flex w-full flex-col bg-gray-100 py-1 px-4 text-gray-800 group-hover:visible">

            <a onClick={() => setSearchType('artist')} className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2">
              Artist  
            </a>

            <a onClick={() => setSearchType('release')} className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black">
              Album 
            </a>

        </div>
    </button> */}
    

    <button className='m-3 p-1 border-2 border-white-600' onClick={handleSearch}>Search</button>

    {/* Check if searchResults exists and then map through releases */}
    <div className='grid grid-cols-4'>

    {searchResults?.results ? (
      searchResults.results.map((album) => (
        <Link to={`/album-info/${album.artist}/${album.title}/${album.id}`} className='bg-slate-500 p-10 m-5 rounded-lg' key={album.id}>
          <img className='size-72' src={album.imageUrl} alt="Album art" />
          <h2 className='font-bold'>{album.title}</h2>
          <p>Artist: {album.artist}</p>
          <p>Key: {album.id}</p>
        </Link>
      ))
    ) : (
      <p>No Albums Found</p>
    )}
    </div>


    </>
  )
}

export default App
