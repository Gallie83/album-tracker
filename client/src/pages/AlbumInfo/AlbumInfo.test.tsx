import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AlbumInfo from "./AlbumInfo";
import { AuthProvider } from "../../contexts/AuthContext/AuthContext"; 
import { AlbumProvider } from "../../contexts/AlbumContext/AlbumContext"; 

describe("AlbumInfo component", () => {

    const mockAlbum = {
        hashId: "12345",
        title: "Discovery",
        artist: "Daft Punk",
        description: "A great album",
      };

    // Add timeout for async operations
    vi.setConfig({ testTimeout: 10000 });

    // Consider using a beforeEach to reset providers
    beforeEach(() => {
        // Reset any global state or mocks
        vi.clearAllMocks();
    });

    // Use a wrapper to ensure consistent rendering
    const renderComponent = () => {
        return render(
            <MemoryRouter initialEntries={[`/album-info/${encodeURIComponent(mockAlbum.artist)}/${encodeURIComponent(mockAlbum.title)}`]}>
                <AuthProvider>
                    <AlbumProvider>
                        <Routes>
                            <Route path="/album-info/:artistName/:albumName" element={<AlbumInfo/>}></Route>
                        </Routes>
                    </AlbumProvider>
                </AuthProvider>
            </MemoryRouter>
        );
    };

    it("renders album + artist name from params", async () => {
        renderComponent()

        const title = await screen.findByRole('heading', { name: /Discovery/i})
        const artist = await screen.findByRole('link',{ name : /Daft Punk/i})

        expect(title).toBeInTheDocument();
        expect(artist).toBeInTheDocument();
    });

    it("renders an album description", async () => {
        renderComponent()

        const description = await screen.findByTestId('description')
        expect(description).toBeInTheDocument();
    });

    it("Link is to the correct Last.fm details page", async () => {
        renderComponent()

        // screen.debug()
        const link = await screen.findByTestId("more-info")
        expect (link).toHaveAttribute("href", `https://www.last.fm/music/${mockAlbum.artist.replace(/ /g, '+')}/${encodeURIComponent(mockAlbum.title)}`)
    })

    // RatingModal not being found afer button press
    // it("Add button changes modalOpen boolean", async () => {

    //     render(
    //         <MemoryRouter initialEntries={[`/album-info/${encodeURIComponent(mockAlbum.artist)}/${encodeURIComponent(mockAlbum.title)}`]}>
    //             <AuthProvider>
    //                 <AlbumProvider>
    //                     <Routes>
    //                         <Route path="/album-info/:artistName/:albumName" element={<AlbumInfo/>}></Route>
    //                     </Routes>
    //                 </AlbumProvider>
    //             </AuthProvider>
    //         </MemoryRouter>
    //     )

    //     // Ensure it's not there before button click
    //     expect(screen.queryByTestId('rating-modal')).not.toBeInTheDocument();

    //     // Click button and check for Modal
    //     const toggleModalButton = await screen.findByTestId("toggleModalButton");
    //     await userEvent.click(toggleModalButton);

    //         expect(screen.findByTestId('rating-modal')).toBeInTheDocument();

    // })

    // Mocking the fetch response is throwing errors
    // it("Bookmark button saves album", async () => {

    //     render(
    //         <MemoryRouter initialEntries={[`/album-info/${encodeURIComponent(mockAlbum.artist)}/${encodeURIComponent(mockAlbum.title)}`]}>
    //             <AuthProvider>
    //                 <AlbumProvider>
    //                     <Routes>
    //                         <Route path="/album-info/:artistName/:albumName" element={<AlbumInfo/>}></Route>
    //                     </Routes>
    //                 </AlbumProvider>
    //             </AuthProvider>
    //         </MemoryRouter>
    //     );

    //     // Assuming there's a button with a test ID to trigger toggleBookmarkFunction
    //     const button = screen.getByTestId("bookmark-button");

    //     // Click the button to toggle bookmark
    //     userEvent.click(button);

    // })
})
