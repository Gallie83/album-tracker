import { useEffect, useState } from 'react'
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
  const [topAlbums, setTopAlbums] = useState<SearchResults>({ results: []});
  const [tags, setTags] = useState<string[]>([])

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

  const fetchTags = async () => {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=${apiKey}&format=json`);
    const data = await response.json()   
    console.log("RES", data.toptags.tag)
    const names = data.toptags.tag.map((tag: {name: string}) => tag.name);
    setTags(names)
    console.log("TAGS:", tags)
  }

  useEffect(() => {
  const fetchTopAlbums = async () => {
    fetchTags()
    try {
      // Returns top charting albums 
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=disco&api_key=${apiKey}&format=json`)
      const data = await response.json()
      console.log("TOP", data.albums.album)
      setTopAlbums({
        results: data.albums.album.map((release: {
        name: string;
        date: string;
        artist: {name: string};
        image: { "#text": string; size: string }[];
      }) => ({
        id: uuidv4(),
        title: release.name,
        artist: release.artist.name,
        imageUrl: release.image?.find(img => img.size === "extralarge")?.["#text"] || ""
        }))
      });
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }
  
  fetchTopAlbums()
}, [])

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


    <button className='m-3 p-1 border-2 border-white-600' onClick={handleSearch}>Search</button>

    {tags}

    {/* Check if searchResults exists and then map through releases */}
    <div className='grid grid-cols-4'>

    {searchResults?.results ? (
      searchResults.results.map((album) => (
        <Link to={`/album-info/${album.artist}/${album.title}`} className='bg-slate-500 p-10 m-5 rounded-lg' key={album.id}>
          <img className='size-72' src={album.imageUrl} alt="Album art" />
          <h2 className='font-bold'>{album.title}</h2>
          <p>Artist: {album.artist}</p>
        </Link>
      ))
    ) : (
      topAlbums.results.map((album) => (
        <Link to={`/album-info/${album.artist}/${album.title}`} className='bg-slate-500 p-10 m-5 rounded-lg' key={album.id}>
          <img className='size-72' src={album.imageUrl} alt="Album art" />
          <h2 className='font-bold'>{album.title}</h2>
          <p>Artist: {album.artist}</p>
        </Link>
      ))
    )}
    </div>


    </>
  )
}

export default App
