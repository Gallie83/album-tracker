import { useState } from 'react'
import './App.css'

// Interfaces
interface Album {
  id: string,
  title: string,
  releaseDate: string,
}

interface SearchResults {
  results: Album[];
} 



function App() {
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  const handleSearch = async () => {
    try {
      const response = await fetch(`https://musicbrainz.org/ws/2/release?query=release:${encodeURIComponent(searchValue)}&fmt=json`);
      const data = await response.json()
      setSearchResults(data.releases);
      console.log(searchResults)
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
    {searchResults?.results && searchResults.results.length > 0 ? (
        <div>
          {searchResults.results.map((result) => (
            <div key={result.id}>
              <h2>{result.title}</h2>
              <p>Release Date: {result.releaseDate}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No albums found.</p>
      )}

    </>
  )
}

export default App
