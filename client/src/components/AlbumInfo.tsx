import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const apiKey = import.meta.env.VITE_APP_API_KEY;

interface AlbumInfo {
    id: string,
    title: string,
    artist: string,
    imageUrl: string 

}

function AlbumInfo() {
    const params = useParams<{artistName:string , albumName: string, albumId: string}>();
    const [album, setAlbum] = useState<AlbumInfo>();

    
    // const name = params.artistName;
    const albumInfo = async (artist: string, album: string, albumId: string) => {
            try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`);
        const data = await response.json()
        if(data.album) {
            const fetchedAlbum: AlbumInfo = {
                id : albumId,
                title: album,
                artist: artist,
                imageUrl: data.album.image?.find(
                    (img: { "#text": string; size: string }) => img.size === "extralarge"
                  )?.["#text"] || "",
            }
            setAlbum(fetchedAlbum);
        }
        console.log(data)
    } catch(error) {
        console.error(error)
    }
}

    useEffect(() => {
        if(params.artistName && params.albumName && params.albumId)
        albumInfo(params.artistName, params.albumName, params.albumId)
    }, [params])
        
    return(
        <>
        {album ? (

            <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={album.imageUrl} alt=""></img>
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{album.title}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{album.artist}</p>
                </div>
            </div>
            ) : ( <p>ERROR</p> )}
        </>

    )
}

export default AlbumInfo