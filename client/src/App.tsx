import { useState } from 'react'
import './App.css'

// Interfaces
interface Album {
  id: string,
  title: string,
  artistCredit: ArtistCredit[],
  date: string
}

interface ArtistCredit {
  name: string,
    id: string
}

interface SearchResults {
  results: Album[]
} 



function App() {
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults>();
  // Changes search type from Album/Artist/genre etc. release is default which searches for albums
  const [searchType, setSearchType] = useState<string>('release');

  // Tracks searchValue input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  const handleSearch = async () => {
    try {
      // Searches for albums based on user input for searchValue
      const response = await fetch(`https://musicbrainz.org/ws/2/${searchType}/?query=${searchType}:${encodeURIComponent(searchValue)}&fmt=json`);
      console.log(searchType)
      const data = await response.json()
      console.log(data)
      // Maps results to searchResults state to match SearchResults interface
      setSearchResults({
        results: data.releases.map((release: { [x: string]: string; id: string; title: string; date: string; }) => ({
          id: release.id,
          title: release.title,
          date: release.date,
          artistCredit: release['artist-credit'], 
        }))
      });
      console.log(searchResults?.results)
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

    <button className="group relative cursor-pointer">
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
    </button>
    

    <button className='m-3 p-1 border-2 border-white-600' onClick={handleSearch}>Search</button>

    {/* Check if searchResults exists and then map through releases */}
    <div className='grid grid-cols-4'>

    {searchResults?.results ? (
      searchResults.results.map((album) => (
        <div className='bg-slate-500 p-10 m-5 rounded-lg' key={album.id}>
          <img className='size-60' src={`https://coverartarchive.org/release/${album.id}/front`} alt="Album art" />
          <h2 className='font-bold'>{album.title}</h2>
          <p>Artist: {album.artistCredit[0]?.name || 'No artist information available'}</p>
          <p>Release Date: {album.date}</p>
        </div>
      ))
    ) : (
      <p>No Albums Found</p>
    )}
    </div>


    </>
  )
}

export default App
