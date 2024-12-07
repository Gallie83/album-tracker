import Navbar from "./Navbar/Navbar"
import Searchbar from "./Searchbar"

function AlbumInfo() {

    return(
      <>

    <div className="flex fixed top-0 left-0 ml-3 mt-3">

    <Navbar />
    </div>

    <Searchbar/>

      <div className="flex items-center justify-center h-screen">
        <h3>Create an Account</h3>

        <form action="">
            <input 
                type="text"
                name="username"
                placeholder="VinylLover123"
            />
            <input 
                type="email"
                name="email"
                placeholder="VinylLover@gmail.com"
            />
            <input 
                type="password"
                name="password"
                placeholder="VinylLover123"
            />
        </form>
      </div>
      </>
    )
}

export default AlbumInfo