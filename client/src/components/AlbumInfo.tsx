import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const apiKey = import.meta.env.VITE_APP_API_KEY;

interface AlbumInfo {
    id: string,
    title: string,
    artist: string,
    imageUrl: string,
    trackList: {
        name: string,
    }[], 
    description: string
}

function AlbumInfo() {
    const params = useParams<{artistName:string , albumName: string, albumId: string}>();
    const [album, setAlbum] = useState<AlbumInfo>();
    const [open, setOpen] = useState(false);


    
    // const name = params.artistName;
    const albumInfo = async (artist: string, album: string) => {
            try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`);
        const data = await response.json()
        if(data.album) {
            const fetchedAlbum: AlbumInfo = {
                id : data.album.mbid,
                title: album,
                artist: artist,
                imageUrl: data.album.image?.find(
                    (img: { "#text": string; size: string }) => img.size === "extralarge"
                  )?.["#text"] || "",
                trackList: data.album.tracks.track.map((track: {name: string, rank:number}) => ({
                    name: track.name,
                    rank: track.rank,
                })) || [],
                description: data.album.wiki.content,
            }
            setAlbum(fetchedAlbum);
        }
        console.log(data)
    } catch(error) {
        console.error(error)
    }
}

    useEffect(() => {
        if(params.artistName && params.albumName )
        albumInfo(params.artistName, params.albumName)
    }, [params])
        
    return(
        <>
        {album ? (
          // Outer div
          <div className="flex items-center justify-center h-screen">
            <div key={album.id} className="flex w-11/12 items-stretch bg-pink-300 border border-gray-200 rounded-lg md:flex-row p-5">
              {/* Left Section with Image and Track List */}
              <div className="flex flex-col w-2/5 p-2 bg-slate-600">
                <img
                  className={`object-cover transition-all duration-500 ${
                    open ? "h-48" : "h-auto"
                  }`}
                  src={album.imageUrl}
                  alt="Album Art"
                />
                {/* Track List Accordion */}
                <div className="w-full mt-4">
                  <label
                    htmlFor="trackListToggle"
                    className="w-full flex justify-center items-center bg-blue-100 hover:bg-blue-500 transition-colors duration-300 ease-in-out cursor-pointer"
                    onClick={() => setOpen(!open)}
                  >
                    Track List
                  </label>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      open ? "h-48 overflow-scroll" : "h-0"
                    } bg-slate-300`}
                  >
                    {album.trackList.map((track, index) => (
                      <p key={index} className="text-black px-4 py-1">
                        {index + 1}. {track.name}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-3/5 bg-green-300 flex flex-col justify-between p-6 px-16 leading-normal">
              {/* Right Sectopn with Summary */}
              <div>
                <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{album.title}</h4>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{album.artist}</p>
              </div>


              <div className="mt-4 border-t pt-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {album.description}
              </div>

              </div>
            </div>
            </div>
        
   ) : ( <p>ERROR</p> )}
        </>
    )
}

export default AlbumInfo