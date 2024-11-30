/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
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

interface AlbumsByGenre {
  [genre: string]: Album[];
}

function App() {
  
  const [searchValue, setSearchValue] = useState<string>('');
  const [albumsByGenre, setAlbumsByGenre] = useState<AlbumsByGenre>({});
  const [tags, setTags] = useState<string[]>([])

  // const carouselRef = useRef({})
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Tracks searchValue input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    // Fetches Genre tags and stores them in state
    const fetchTags = async () => {
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=${apiKey}&format=json`);
      const data = await response.json()   
      const names = data.toptags.tag.map((tag: {name: string}) => tag.name);
      setTags(names)
      console.log("TAGS", tags)
    }

    fetchTags()
  }, [])

  useEffect(() => {
    // Make sure tags is populated 
    if(tags.length === 0) return

    const fetchTopAlbums = async () => {
    try {
      const albumPromises = tags.map(async (tag) => {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${tag}&api_key=${apiKey}&format=json`
        );
        const data = await response.json();
        console.log("DATA", data)
        
        // Check if data.albums and data.albums.album exist and are arrays
        if (data.albums && Array.isArray(data.albums.album)) {
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
  }, [tags])

  // Scrolls carousel using left+right buttons 
  const scrollCarousel = (genre: string, direction: "next" | "prev") => {
    const carousel = carouselRefs.current[genre];

    const scrollAmount = 1300;
    if(carousel) {
      carousel.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      })
    } else {
      console.log("No carousel")
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


    <Link to={`/search/${searchValue}`} className='m-3 p-1 border-2 border-white-600'>Search</Link>

    <div className="grid grid-cols-12">

    {tags.map((tag) => (
      // <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-gray-700 bg-gray-100">
      //   <div className="text-xs font-normal leading-none max-w-full">{tag}</div>
      // </div>
      <p></p>
    ))}
    </div>

    {/* Display genres with best albums  */}
    {Object.entries(albumsByGenre).map(([genre, albums]) => (
      <div 
        id="controls-carousel" 
        className="relative w-full" 
        data-carousel="static"
        key={genre}
      >
        {/* Genre Title */}
        <h1>{genre.toUpperCase()}</h1>
        {/* Carousel wrapper */}
        <div 
          className="relative bg-pink-300 overflow-x-auto rounded-lg mb-5 md:h-80 scroll-bar"
            ref={(el) => (carouselRefs.current[genre] = el)}
            style={{ scrollSnapType: "x mandatory"}}
        >
            {/* Carousel Items */}
            <div 
              className="flex gap-5 ease-in-out" 
              data-carousel-item
              >
            {albums.map((album) => (
              <Link
                to={`/album-info/${album.artist}/${album.title}`}
                className="bg-slate-500 px-3 py-2 mx-3 my-2 rounded-lg"
                key={album.id}
              >
                <div className='h-48 w-48'>
                <img className="object-fill" src={album.imageUrl} alt="Album art" />
                </div>
                <div className='mt-3'>
                <h2 className="font-bold text-ellipsis overflow-hidden line-clamp-2">{album.title}</h2>
                <p className='text-ellipsis overflow-hidden line-clamp-1'>{album.artist}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>


    {/* Slider controls */}
        <button
          type="button"
          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={() => scrollCarousel(genre, "prev")}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={() => scrollCarousel(genre, "next")}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
      ))}
    </>
  )
}

export default App
