import { useState } from 'react'
import './App.css'

// Interfaces
interface Album {
  id: string,
  title: string,
  artistCredit: ArtistCredit[],
  date: string,
}

interface ArtistCredit {
  name: string,
    id: string,
}

interface SearchResults {
  results: Album[];
} 



function App() {
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  const handleSearch = async () => {
    try {
      const response = await fetch(`https://musicbrainz.org/ws/2/release?query=release:${encodeURIComponent(searchValue)}&fmt=json`);
      const data = await response.json()
      setSearchResults({results: data.releases});
      console.log(searchResults)
      console.log(searchResults?.results)
    } catch(error) {
      console.log('Error fetching data:', error);
    }
  }

  return (
    <>
    <h1>Album Search</h1>
    <input 
      type="text"
      value={searchValue} 
      onChange={handleInputChange}
    />
    <button onClick={handleSearch}>Search</button>

    {/* Check if searchResults exists and then map through releases */}
    {searchResults?.results ? (
      searchResults.results.map((album) => (
        <div key={album.id}>
          <h2>{album.title}</h2>
          <p>Artist: {album.artistCredit?.[0]?.name || 'No artist information available'}</p>
          <p>Release Date: {album.date}</p>
        </div>
      ))
    ) : (
      <p>No Albums Found</p>
    )}


    </>
  )
}

export default App
