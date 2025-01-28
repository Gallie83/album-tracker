import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Searchbar from './Searchbar';
import Navbar from './Navbar/Navbar';

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

  return (
    <>
    <div className="flex fixed top-0 left-0 ml-3 mt-3">

    <Navbar />
    </div>

    <Searchbar/>
    {/* Check if searchResults exists and then map through releases */}
    {searchResults?.results ? (
      // Display search results in a grid
      <div className="grid grid-cols-4 gap-5">
        {searchResults.results.map((album) => (

          // TODO: handle special characters before directing users to next page
          <Link
            to={`/album-info/${encodeURIComponent(album.artist)}/${encodeURIComponent(album.title)}`}
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
