import { useEffect} from "react";
import { useParams } from "react-router-dom"

const apiKey = import.meta.env.VITE_APP_API_KEY;

interface ArtistInfo {
    id: string,
    name: string,
    imageUrl: string,
    releases: {
        name: string,
    }[], 
    description?: string,
    url: string 
}

function AlbumInfo() {
    const params = useParams<{artistName:string}>();
    // const [artist, setArtist] = useState<ArtistInfo>();


    
    // const name = params.artistName;
    const artistInfo = async (artist: string) => {
            try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&format=json`);
        const data = await response.json()
        console.log(data)
        // if(data.album) {
        //     const fetchedAlbum: ArtistInfo = {
        //         id : data.album.mbid,
        //         name: artist,
        //         imageUrl: data.album.image?.find(
        //             (img: { "#text": string; size: string }) => img.size === "extralarge"
        //           )?.["#text"] || "",
        //         trackList: data.album.tracks.track.map((track: {name: string, rank:number}) => ({
        //             name: track.name,
        //             rank: track.rank,
        //         })) || [],
        //         description: data.album.wiki?.content || "No description available.",
        //         url: data.album.url
        //     }
        //     setAlbum(fetchedAlbum);
        // }
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

        </>
    )
}

export default AlbumInfo