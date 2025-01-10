import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import { describe, it, expect } from 'vitest'
import AlbumInfo from "./AlbumInfo";
import { AuthProvider } from "../../contexts/AuthContext/AuthContext"; 
import { AlbumProvider } from "../../contexts/AlbumContext/AlbumContext"; 

describe("AlbumInfo component", () => {
    it("renders album + artist name from params", async () => {
        render(
            <MemoryRouter initialEntries={["/album-info/Daft%20Punk/Discovery"]}>
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
    })
})
