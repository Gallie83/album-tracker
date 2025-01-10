import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AlbumInfo from "./AlbumInfo";

console.log("EXPECT:",expect)

describe("AlbumInfo component", () => {
    it("renders album + artist name", () => {
        render(
            <MemoryRouter initialEntries={["/album-info/Daft%20Punk/Discovery"]}>
                <Routes>
                    <Route path="/album-info/:artistName/:albumName" element={<AlbumInfo/>}></Route>
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText("Discovery")).toBeInTheDocument();
        expect(screen.getByText("Daft Punk")).toBeInTheDocument();
    })
})
