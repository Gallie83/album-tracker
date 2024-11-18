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
                })) || []
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
          <div className="flex items-center justify-center h-screen overflow-hidden">
            <div key={album.id} className="flex w-11/12 items-center bg-pink-300 border border-gray-200 rounded-lg md:flex-row p-5">
              <img className="w-10/12 p-5 rounded-t-lg md:rounded-none md:rounded-s-lg" src={album.imageUrl} alt="Album Art"></img>
              <div className="flex flex-col justify-between h-full w-full bg-brown-600 px-16 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{album.title}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{album.artist}</p>

              {/* Track List Accordion */}
                <div className="w-full">
                    <input
                      id="expandCollapse"
                      checked={open}
                      type="checkbox"
                      className="peer sr-only"
                      />
                    <label
                      htmlFor="expandCollapse"
                      className="
                      w-full flex justify-center items-center bg-blue-100
                      hover:bg-blue-500
                      transition-colors duration-1000 ease-in-out"
                      onClick={() => setOpen(!open)}
                      >
                      Track List
                    </label>
                    <div
                      className=
                          "overflow-hidden h-0 bg-slate-300 peer-checked:h-[200px] peer-checked:overflow-scroll transition-[height] duration-1000 ease-in-out">
                                {album.trackList.map((track, index) => (
                                    <p key={index} className="text-black">{index+1}. {track.name}</p>
                                ))}
                    </div>
                </div>
              </div>
            </div>
          </div>
   ) : ( <p>ERROR</p> )}
        </>
    )
}

export default AlbumInfo