import Navbar from "./Navbar/Navbar"
import Searchbar from "./Searchbar"

function Login() {

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("LOGIN")
        event?.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/users');
            if(!response.ok) {
                console.error("Failed to Fetch users:", response.statusText);
                return
            }
            const data = await response.json();
            console.log("USERS:", data);
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

    <div className="min-h-screen mt-5 text-left text-black bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form method="POST" onSubmit={handleLogin}>

                <div className="mt-6">
                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input name="email" placeholder="VinylLover@example.com" type="email"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"></input>
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 rounded-md shadow-sm">
                        <input name="password" type="password"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"></input>
                    </div>
                </div>

                <div className="mt-6">
                    <span className="block w-full rounded-md shadow-sm">
                        <button type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                            Login
                        </button>
                    </span>
                </div>
            </form>

        </div>
    </div>
</div>
      </>
    )
}

export default Login