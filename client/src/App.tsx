import { useState } from 'react'
import './App.css'

function App() {
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<unknown>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  const handleSearch = async () => {
    try {
      const response = await fetch(`https://musicbrainz.org/ws/2/release?query=release:${encodeURIComponent(searchValue)}&fmt=json`);
      const data = await response.json()
      setSearchResults(data);
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
    </>
  )
}

export default App
