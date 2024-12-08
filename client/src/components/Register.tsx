import Navbar from "./Navbar/Navbar"
import Searchbar from "./Searchbar"

function AlbumInfo() {

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        const newUser = {
            username: event?.currentTarget.username.value,
            email: event?.currentTarget.email.value,
            password: event?.currentTarget.password.value,
            userAlbums: [],
            savedAlbums: [],
            groups: [],
        }

        try {
            const response = await fetch('http://localhost:3000/user/new', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( newUser )
            });
            if(!response.ok) {
                console.error("Failed to create new user:", response);
                return
            }
            console.log("USER ADDED:", newUser); 
        } catch (error) {
            console.error("Error creating user:", error)
        }
    }

    return(
      <>

    <div className="flex fixed top-0 left-0 ml-3 mt-3">

    <Navbar />
    </div>

    <Searchbar/>

      <div className="flex items-center justify-center h-screen">
        <h3>Create an Account</h3>

        <form onSubmit={handleRegister} className="text-black">
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
                placeholder="Password"
            />
            <button onClick={() => handleRegister}>Submit</button>
        </form>
      </div>
      </>
    )
}

export default AlbumInfo