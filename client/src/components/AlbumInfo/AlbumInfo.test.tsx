import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import { describe, it, expect } from 'vitest'
import AlbumInfo from "./AlbumInfo";
import { AuthProvider } from "../../contexts/AuthContext/AuthContext"; 
import { AlbumProvider } from "../../contexts/AlbumContext/AlbumContext"; 
import userEvent from "@testing-library/user-event"

describe("AlbumInfo component", () => {

    const mockAlbum = {
        hashId: "12345",
        title: "Discovery",
        artist: "Daft Punk",
        description: "A great album",
      };

    it("renders album + artist name from params", async () => {
        render(
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

        const title = await screen.findByRole('heading', { name: /Discovery/i})
        const artist = await screen.findByRole('link',{ name : /Daft Punk/i})

        expect(title).toBeInTheDocument();
        expect(artist).toBeInTheDocument();
    });

    it("renders an album description", async () => {
        render(
            <MemoryRouter initialEntries={[`/album-info/${encodeURIComponent(mockAlbum.artist)}/${encodeURIComponent(mockAlbum.title)}`]}>
                <AuthProvider>
                    <AlbumProvider>
                        <Routes>
                            <Route path="/album-info/:artistName/:albumName" element={<AlbumInfo/>}></Route>
                        </Routes>
                    </AlbumProvider>
                </AuthProvider>
            </MemoryRouter>
        )

        const description = await screen.findByTestId('description')
        expect(description).toBeInTheDocument();
    });

    it("Modal only shows once button is clicked", async () => {
        render(
            <MemoryRouter initialEntries={[`/album-info/${encodeURIComponent(mockAlbum.artist)}/${encodeURIComponent(mockAlbum.title)}`]}>
                <AuthProvider>
                    <AlbumProvider>
                        <Routes>
                            <Route path="/album-info/:artistName/:albumName" element={<AlbumInfo/>}></Route>
                        </Routes>
                    </AlbumProvider>
                </AuthProvider>
            </MemoryRouter>
        )

        screen.debug()

        // Ensure it's not there before button click
        expect(screen.queryByTestId('rating-modal')).not.toBeInTheDocument();

        // Click button and check for Modal
        const toggleModalButton = await screen.findByTestId("toggleModalButton");
        await userEvent.click(toggleModalButton);

        const modal = await screen.findByTestId('rating-modal');
        expect(modal).toBeInTheDocument();

        screen.debug();
    })

    // it("Link is to the correct Last.fm details page", () => {
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


    //     // Ensure it's not there before button click
    //     expect(screen.queryByTestId('rating-modal')).not.toBeInTheDocument();

    //     // Click button and check for Modal
    //     const toggleModalButton = screen.getByText(/Add/i);
    //     userEvent.click(toggleModalButton);
    //     expect(screen.queryByTestId('rating-modal')).toBeInTheDocument();
    // })
})
