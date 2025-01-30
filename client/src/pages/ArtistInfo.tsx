import { useEffect, useState} from "react";
import { useParams } from "react-router-dom"

const apiKey = import.meta.env.VITE_APP_API_KEY;

interface ArtistInfo {
    id: string,
    name: string,
    imageUrl?: string,
    // releases: {
    //     name: string,
    // }[], 
    description?: string,
    url: string 
}

function ArtistInfo() {
    const params = useParams<{artistName:string}>();
    const [artist, setArtist] = useState<ArtistInfo>();


    
    // const name = params.artistName;
    const artistInfo = async (artist: string) => {
            try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&format=json`);
        const data = await response.json()
        console.log(data)
        if(data.artist) {
            const fetchedArtist: ArtistInfo = {
                id : data.mbid,
                name: artist,
                description: data.artist.bio?.content || "No description available.",
                url: data.artist.url
            }
            setArtist(fetchedArtist);
        }
    } catch(error) {
        console.error(error)
        }
    }

    useEffect(() => {
        if(params.artistName)
        artistInfo(params.artistName)
    }, [params])
        
    return(
        <>
        {artist ? (
          // Outer div
          <div className="flex items-center justify-center h-screen">
            <div className="flex w-11/12 items-stretch bg-pink-300 border border-gray-200 rounded-lg md:flex-row p-5">
              {/* Left Section with Image */}
              <div className="flex flex-col w-2/5 p-2 bg-slate-600">
                <img
                  className={`object-contain transition duration-700 ease-in-out h-auto`}
                  src={`https://musicbrainz.org/ws/artist/${artist.id}/?inc=url-rels`}

                  alt="Album Art"
                />
              </div>
              
              {/* Right Section with Summary */}
              <div className="w-3/5 bg-green-300 flex flex-col justify-between p-6 px-16 leading-normal">
              <div>
                <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{artist.name}</h4>
              </div>

              {/* Album information */}
              <div className="mt-4 border-t pt-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {artist.description}
              </div>

              {/* Link to Album page on Last.fm */}
                <a target="_blank" rel="noopener noreferrer" className="border border-black p-1 bg-stone-400" href={artist.url}>More info</a>

              </div>
            </div>
            </div>
        
   ) : ( <p>ERROR</p> )}
        </>
    )
}

export default ArtistInfo