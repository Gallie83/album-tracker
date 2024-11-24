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

interface AlbumsByGenre {
  [genre: string]: Album[];
}



function App() {
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults>();
  const [albumsByGenre, setAlbumsByGenre] = useState<AlbumsByGenre>({});
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

  // Fetches Genre tags and stores them in state
  const fetchTags = async () => {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=${apiKey}&format=json`);
    const data = await response.json()   
    const names = data.toptags.tag.map((tag: {name: string}) => tag.name);
    setTags(names)
    console.log("TAGS", tags)
  }

  useEffect(() => {
  const fetchTopAlbums = async () => {
    // Gets genre tags
    fetchTags()
    try {
      console.log("1")
      const albumPromises = tags.map(async (tag) => {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${tag}&api_key=${apiKey}&format=json`
        );
        const data = await response.json();
        console.log("DATA", data)
        
    // Check if data.albums and data.albums.album exist and are arrays
    if (data.albums && Array.isArray(data.albums.album)) {
      console.log("Start")
      // Set data for the genre
      return {
        [tag]: data.albums.album.map((release: {
          name: string;
          artist: { name: string };
          image: { "#text": string; size: string }[];
        }) => ({
          id: uuidv4(),
          title: release.name,
          artist: release.artist.name,
          imageUrl: release.image?.find(img => img.size === "extralarge")?.["#text"] || "",
        })),
      };
    } else {
      console.error(`No albums found for tag ${tag} or incorrect structure`);
      return { [tag]: [] };  // Return empty array if no albums are found
    }
  });
  
      // Resolve all promises and merge results
      const results = await Promise.all(albumPromises);
      const albumData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  
      setAlbumsByGenre(albumData);
      console.log("ABG", albumsByGenre);
    } catch (error) {
      console.error("Error fetching albums by genre:", error);
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

    <div className="grid grid-cols-12">

    {tags.map((tag) => (
      <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-gray-700 bg-gray-100">
        <div className="text-xs font-normal leading-none max-w-full">{tag}</div>
      </div>
    ))}
    </div>

    {/* Check if searchResults exists and then map through releases */}
    <div className='grid grid-cols-4'>



    {searchResults?.results ? (
      searchResults.results.map((album) => (
        <Link to={`/album-info/${album.artist}/${album.title}`} className='bg-slate-500 p-5 m-5 rounded-lg' key={album.id}>
          <img className='size-72' src={album.imageUrl} alt="Album art" />
          <h2 className='font-bold'>{album.title}</h2>
          <p>Artist: {album.artist}</p>
        </Link>
      ))
    ) : (
      Object.entries(albumsByGenre).map(([genre, albums]) => (
        <div key={genre}>
          <h2>{genre}</h2>
          {albums.map(album => (
            <p key={album.id}>{album.title}</p>
          ))}
        </div>
      ))
    )}
    </div>


    </>
  )
}

export default App
